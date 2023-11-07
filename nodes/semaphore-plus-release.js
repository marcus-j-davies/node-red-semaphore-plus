module.exports = function (RED) {
	function Release(config) {
		RED.nodes.createNode(this, config);
		const self = this;
		self._Controller = RED.nodes.getNode(config.config);

		self.status({
			fill: self._Controller.getStatus().count > 0 ? 'yellow' : 'green',
			shape: 'dot',
			text: `GQ ${self._Controller.getStatus().count} | LAFS ${
				self._Controller.getStatus().time
			}`
		});

		const Status = (GlobalQueueLength, FS) => {
			self.status({
				fill: GlobalQueueLength > 0 ? 'yellow' : 'green',
				shape: 'dot',
				text: `GQ ${GlobalQueueLength} | LAFS ${FS}`
			});
		};

		self._Controller.registerStatus({ id: self.id, cb: Status });

		self.on('close', (removed, done) => {
			self._Controller.deRegisterStatus(self.id);
			done();
		});

		self.on('input', (msg, send, done) => {
			const shouldReset = msg.smp_reset === true;
			const shouldResetAndStop = msg.reset === true;

			if (shouldResetAndStop) {
				self._Controller.atomicRelease().then(() => {
					done();
				});
			} else if (shouldReset) {
				self._Controller.atomicRelease().then(() => {
					delete msg.smp_reset;
					send(msg);
					done();
				});
			} else {
				self._Controller.release().then(() => {
					delete msg.smp_reset;
					send(msg);
					done();
				});
			}
		});
	}
	RED.nodes.registerType('semaphore-plus-release', Release);
};
