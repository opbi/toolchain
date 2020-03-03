import prometheus from 'prom-client';

const { register } = prometheus;

const metricsView = async (req, res) => {
  res.type(register.contentType).send(register.metrics());
};

export default metricsView;
