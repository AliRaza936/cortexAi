import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const createConversations = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    console.log(userId);
    const conversation = await Conversation.create({
      userId: userId,
    });

    return res.status(201).json(conversation);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: `Error creating conversation ${error}` });
  }
};


export const getConversations = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    console.log(userId);
    const conversation = await Conversation.find({
      userId: userId,
    }).sort({updatedAt: -1});

    return res.status(201).json(conversation);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: `Error get conversation ${error}` });
  }
};

export const updateConversations = async (req, res) => {
  try {
    const {id,title} = req.body
    const conversation = await Conversation.findByIdAndUpdate(
      id,
      { title },
      { new: true }
    );
    return res.status(201).json(conversation);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: `update conversation error ${error}` });
  }
};


export const saveMessage = async (req, res) => {
  try {
    const {conversationId,role, content,images,artifacts} = req.body;
    const message = await Message.create({
        conversationId,
        role,
        content,
        images,
        artifacts
    })
    return res.status(201).json(message);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: `create message error ${error}` });
  }
};


export const getMessages = async (req, res) => {
  try {

    const messages = await Message.find({
        conversationId : req.params.conversationId,
        
    })
    return res.status(201).json(messages);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: `get messages error ${error}` }); 
  }
};