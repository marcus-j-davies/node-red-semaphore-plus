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
		let isFailsafe = false;

		function UpdateNodes() {
			for (let i = 0; i < _callbacks.length; i++) {
				_callbacks[i].cb(_queue, _fsTime > 0 ? _fsTime : 'Disabled');
			}
		}

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
						isFailsafe = true;
						await _permit.release();
						isFailsafe = false;
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
					isFailsafe = true;
					await _permit.release();
					isFailsafe = false;
				}, Time);
			}
			return isFailsafe;
		};

		self.release = async function () {
			if (_timer) {
				clearTimeout(_timer);
				_timer = undefined;
			}
			if (_permit && !_permit.isReleased) {
				await _permit.release();
				return;
			}
			return;
		};
	}

	RED.nodes.registerType('semaphore-plus-config', Config);
};
