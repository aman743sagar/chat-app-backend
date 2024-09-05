const Conversation = require('../MODEL/ConverseationModel');
const Message = require('../MODEL/Message');
async function sendMessage(req, res){
    try {
        const senderId=req.id;
        const reciverId=req.params.id;
        const {message}=req.body;
        let gotconversation=await Conversation.findOne({
            participant:{$all:[senderId,reciverId]}
        })
        if(!gotconversation){
            gotconversation=await Conversation.create({
                participant:[senderId, reciverId]
            })
        }
        const newmessage=await Message.create({
            senderId,
            reciverId,
            message
        })
        if(newmessage){
            gotconversation.messages.push(newmessage._id);
        }
        await gotconversation.save();
        //SOCKET IO

        return res.status(200).json({
            message:"Message send succecfully"
        })
    } catch (error) {
        console.log(error)
    }
}

async function getmessage(req,res){
    try {
        const reciverId=req.params.id;
        const senderId=req.id;
        const conversation=await Conversation.findOne({
            participant:{$all:[senderId,reciverId]}

        }).populate("messages");
        return res.status(200).json(conversation?.messages)

    } catch (error) {
       console.log(error)

    }

}


module.exports={
    sendMessage,
    getmessage
}