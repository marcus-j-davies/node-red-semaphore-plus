module.exports = function (RED) {
	function Release(config) {
		RED.nodes.createNode(this, config);
		const self = this;
		self._Controller = RED.nodes.getNode(config.config);

		self.status({
			fill: self._Controller.getStatus().count > 0 ? 'yellow' : 'green',
			shape: 'dot',
			text: `GQ : ${self._Controller.getStatus().count}, LFS (ms) : ${
				self._Controller.getStatus().time
			}`
		});

		const Status = (GlobalQueueLength, FS) => {
			self.status({
				fill: GlobalQueueLength > 0 ? 'yellow' : 'green',
				shape: 'dot',
				text: `GQ : ${GlobalQueueLength}, LFS (ms) : ${FS}`
			});
		};

		self._Controller.registerStatus({ id: self.id, cb: Status });

		self.on('close', (removed, done) => {
			self._Controller.deRegisterStatus(self.id);
			done();
		});

		self.on('input', (msg, send, done) => {
			self._Controller.release().then(() => {
				send(msg);
				done();
			});
		});
	}
	RED.nodes.registerType('semaphore-plus-release', Release);
};
