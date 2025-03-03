export default fetch = async (req, res) => {
    try {
        return res,json('Hello World')
    } catch (error) {
        res.status(500).json({ error:"internal server error" });
    }
}