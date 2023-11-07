module.exports = function (RED) {
	function Reset(config) {
		RED.nodes.createNode(this, config);
		const self = this;
		self._Controller = RED.nodes.getNode(config.config);

		self.status({
			fill: self._Controller.getStatus().count > 0 ? 'yellow' : 'green',
			shape: 'dot',
			text: `GQ ${self._Controller.getStatus().count} | DFS ${
				config.timeout < 1 ? 'None' : config.timeout
			} | LAFS ${self._Controller.getStatus().time}`
		});

		const Status = (GlobalQueueLength, FS) => {
			self.status({
				fill: GlobalQueueLength > 0 ? 'yellow' : 'green',
				shape: 'dot',
				text: `GQ ${GlobalQueueLength} | DFS ${
					config.timeout < 1 ? 'None' : config.timeout
				} | LAFS ${FS}`
			});
		};

		self._Controller.registerStatus({ id: self.id, cb: Status });

		self.on('close', (removed, done) => {
			self._Controller.deRegisterStatus(self.id);
			done();
		});

		self.on('input', (msg, send, done) => {
			const _Timeout = msg.smp_failsafeTimeout || config.timeout;
			self._Controller.reset(parseInt(_Timeout));
			msg.smp_appliedFailsafe = parseInt(_Timeout);
			delete msg.smp_failsafeTimeout;
			send(msg);
			done();
		});
	}
	RED.nodes.registerType('semaphore-plus-fs-reset', Reset);
};
