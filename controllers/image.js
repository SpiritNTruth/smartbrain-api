const Clarifai = require ('clarifai');

const app = new Clarifai.App({
  apiKey: '825a27b4eaae4934b598a6949088f34d'
 });

 const handleApiCall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => res.json(data))
    .catch(err => res.status(400).json('Unable to work with API'))
 }

const handleImage = (req, res, pgdb) => {
  const { id } = req.body;
  pgdb('users')
    .where('id', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => res.json(entries[0]))
    .catch(err => res.status(400).json('Error getting entries count'))
}

module.exports = {
  handleImage,
  handleApiCall
}