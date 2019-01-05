import { app, uuid, errorHandler } from 'mu';

app.get('/ping', function( req, res, next ) {
  return res.status(200).send({ message: "echo" });
});

app.use(errorHandler);
