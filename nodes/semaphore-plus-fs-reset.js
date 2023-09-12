module.exports = function (RED) {
	function Reset(config) {
		RED.nodes.createNode(this, config);
		const self = this;
		self._Controller = RED.nodes.getNode(config.config);

		self.status({ fill: 'green', shape: 'dot', text: 'GQ : 0, LFS (ms) : 0' });

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
			const _Timeout = msg.sp_timeout || config.timeout;
			self._Controller.reset(parseInt(_Timeout));
			delete msg.sp_timeout;
			send(msg);
			done();
		});
	}
	RED.nodes.registerType('semaphore-plus-fs-reset', Reset);
};
