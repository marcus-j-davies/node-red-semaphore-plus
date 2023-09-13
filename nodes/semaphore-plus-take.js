module.exports = function (RED) {
	function Take(config) {
		RED.nodes.createNode(this, config);
		const self = this;
		self._Controller = RED.nodes.getNode(config.config);

		let _Queue = 0;

		self.status({
			fill: 'green',
			shape: 'dot',
			text: `LQ : 0, GQ : ${self._Controller.getStatus().count}, LFS (ms) : ${
				self._Controller.getStatus().time
			}`
		});

		const Status = (GlobalQueueLength, FS) => {
			self.status({
				fill: _Queue > 0 ? 'yellow' : 'green',
				shape: 'dot',
				text: `LQ : ${_Queue}, GQ : ${GlobalQueueLength}, LFS (ms) : ${FS}`
			});
		};

		self._Controller.registerStatus({ id: self.id, cb: Status });

		self.on('close', (removed, done) => {
			self._Controller.deRegisterStatus(self.id);
			done();
		});

		self.on('input', (msg, send, done) => {
			_Queue++;
			const _Timeout = msg.smp_failsafeTimeout || config.timeout;
			self._Controller.take(parseInt(_Timeout)).then((smp_isFailsafe) => {
				_Queue--;
				delete msg.smp_failsafeTimeout;
				msg.smp_isFailsafe = smp_isFailsafe;
				send(msg);
				done();
			});
		});
	}
	RED.nodes.registerType('semaphore-plus-take', Take);
};
