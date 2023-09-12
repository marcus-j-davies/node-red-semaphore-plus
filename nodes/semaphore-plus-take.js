module.exports = function (RED) {
  function Take(config) {
    RED.nodes.createNode(this, config);
    const self = this;
    self._Controller = RED.nodes.getNode(config.config);

    let _Queue = 0;

    const Status = (GlobalQueueLength, FS) => {
      self.status({
        fill: _Queue > 0 ? "yellow" : "green",
        shape: "dot",
        text: `LQ : ${_Queue}, GQ : ${GlobalQueueLength}, LFS (ms) : ${FS}`,
      });
    };

    self._Controller.registerStatus({ id: self.id, cb: Status });

    self.on("close", (removed, done) => {
      self._Controller.deRegisterStatus(self.id);
      done();
    });

    self.on("input", (msg, send, done) => {
      _Queue++;
      const _Timeout = msg.sp_timeout || config.timeout;
      self._Controller.take(parseInt(_Timeout)).then(() => {
        _Queue--;
        delete msg.sp_timeout;
        send(msg);
        done();
      });
    });
  }
  RED.nodes.registerType("semaphore-plus-take", Take);
};
