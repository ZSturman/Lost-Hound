import imageRecognitionController from "../model/imageRecognitionController.js";

const getMatches = async (req, res) => {
  try {
    const id = req.params.postid;

    const results = await imageRecognitionController.runImageRecognition(id);

    return res.status(200).json(results);
  } catch (error) {
    console.error("Model error: " + error.message);
    return res.status(500).json("Error getting matches: " + error.message);
  }
};

export default getMatches;
