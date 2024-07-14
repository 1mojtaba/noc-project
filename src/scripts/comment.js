import axios from "axios";

const edit = async (topicID, comment, product, tag) => {
    const response = await axios.post('/editrecord.php', {
        topicID: topicID,
        newComment: comment,
        selectedProduct: product,
        selectedTag: tag,
    }, {
        headers: {
            "Content-Type": 'application/x-www-form-urlencoded',
        }
    })

    return response.status === 200
}

export default edit
