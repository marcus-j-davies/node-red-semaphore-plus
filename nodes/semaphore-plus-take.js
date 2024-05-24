module.exports = function (RED) {
	function Take(config) {
		RED.nodes.createNode(this, config);
		const self = this;
		self._Controller = RED.nodes.getNode(config.config);

		let _Queue = 0;

		self.status({
			fill: self._Controller.getLockStatus() ? 'green' : 'yellow',
			shape: 'ring',
			text: `LQ 0 | GQ  ${self._Controller.getStatus().count} | DFS ${
				config.timeout < 1 ? 'None' : config.timeout
			} | LAFS ${self._Controller.getStatus().time}`
		});

		const Status = (GlobalQueueLength, FS) => {
			self.status({
				fill: self._Controller.getLockStatus() ? 'green' : 'yellow',
				shape: _Queue > 0 ? 'dot' : 'ring',
				text: `LQ ${_Queue} | GQ ${GlobalQueueLength} | DFS ${
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
			const Queue = () => {
				_Queue++;
				const _Timeout = msg.smp_failsafeTimeout || config.timeout;
				self._Controller.take(parseInt(_Timeout)).then((smp_isFailsafe) => {
					_Queue--;
					delete msg.smp_failsafeTimeout;
					if (!self._Controller.isInReset()) {
						msg.smp_isFailsafe = smp_isFailsafe;
						msg.smp_appliedFailsafe = parseInt(_Timeout);
						send([msg, undefined]);
						done();
					}
				});
			};

			if (config.avoidance === 'never') {
				Queue();
			}

			if (config.avoidance === 'msg') {
				if (config.partType === 'msg') {
					const Value = RED.util.evaluateNodeProperty(
						config.msgPart,
						config.partType,
						self,
						msg
					);
					if (Value === true) {
						send([undefined, msg]);
						done();
					} else {
						Queue();
					}
				} else {
					const EXP = RED.util.prepareJSONataExpression(config.msgPart, self);
					RED.util.evaluateJSONataExpression(EXP, msg, (Err, Res) => {
						if (Res === true) {
							send([undefined, msg]);
							done();
						} else {
							Queue();
						}
					});
				}
			}

			if (config.avoidance === 'locked') {
				if (!self._Controller.getLockStatus()) {
					send([undefined, msg]);
					done();
				} else {
					Queue();
				}
			}

			if (config.avoidance === 'threshold') {
				if (self._Controller.getStatus().count >= config.threshold) {
					send([undefined, msg]);
					done();
				} else {
					Queue();
				}
			}
		});
	}
	RED.nodes.registerType('semaphore-plus-take', Take);
};
