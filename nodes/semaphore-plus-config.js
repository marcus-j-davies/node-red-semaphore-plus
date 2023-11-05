const { Semaphore } = require('@shopify/semaphore');
module.exports = function (RED) {
	function Config(Config) {
		RED.nodes.createNode(this, Config);
		const self = this;

		self._semaphore = new Semaphore(1);

		let _permit;
		let _timer;
		let _callbacks = [];
		let _fsTime = 0;
		let _queue = 0;
		let _smp_isFailsafe = false;
		let _isInReset = false;

		function UpdateNodes() {
			for (let i = 0; i < _callbacks.length; i++) {
				_callbacks[i].cb(_queue, _fsTime > 0 ? _fsTime : 'Disabled');
			}
		}

		self.getLockStatus = function () {
			return _permit?.isReleased;
		};

		self.isInReset = function () {
			return _isInReset;
		};

		self.atomicReset = async function () {
			_isInReset = true;
			while (!_permit.isReleased) {
				await _permit.release();
				_smp_isFailsafe = false;
				if (_timer) {
					clearTimeout(_timer);
					_timer = undefined;
				}
			}
			_isInReset = false;
			UpdateNodes();
		};

		self.getStatus = function () {
			return {
				time: _fsTime > 0 ? _fsTime : 'Disabled',
				count: _queue
			};
		};

		self.registerStatus = function (Details) {
			_callbacks.push(Details);
		};

		self.deRegisterStatus = function (ID) {
			_callbacks = _callbacks.filter((CB) => CB.id !== ID);
		};

		self.reset = function (Time) {
			if (_timer) {
				clearTimeout(_timer);
				_timer = undefined;
			}
			_fsTime = Time;
			if (Time > 0) {
				_timer = setTimeout(async () => {
					if (_permit && !_permit.isReleased) {
						_smp_isFailsafe = true;
						await _permit.release();
						UpdateNodes();
						_smp_isFailsafe = false;
					}
				}, Time);
			}

			UpdateNodes();
		};

		self.take = async function (Time) {
			_queue++;
			setTimeout(() => {
				UpdateNodes();
			}, 10);
			const Temp = await self._semaphore.acquire();
			_queue--;
			setTimeout(() => {
				UpdateNodes();
			}, 10);
			_permit = Temp;
			_fsTime = Time;
			if (Time > 0) {
				_timer = setTimeout(async () => {
					_smp_isFailsafe = true;
					await _permit.release();
					UpdateNodes();
					_smp_isFailsafe = false;
				}, Time);
			}
			return _smp_isFailsafe;
		};

		self.release = async function () {
			if (_timer) {
				clearTimeout(_timer);
				_timer = undefined;
			}
			if (_permit && !_permit.isReleased) {
				await _permit.release();
				UpdateNodes();
				return;
			}
			return;
		};

		self.on('close', (removed, done) => {
			_callbacks = [];
			done();
		});
	}

	RED.nodes.registerType('semaphore-plus-config', Config);
};
