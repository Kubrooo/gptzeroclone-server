import Detection from "../models/Detection.js";

export const getHistory = async (req, res, next) => {
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const detections = await Detection.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('-text');

        const total = await Detection.countDocuments({ user: req.user._id });

        res.json({
            detections,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

export const deleteDetection = async (req, res, next) => {
    try{
        const detection = await Detection.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!detection) {
            return res.status(404).json({
                error: 'Detection not found'
            });
        }

        await Detection.deleteOne({ _id: req.params.id });
        res.json({ message: 'Detection deleted successfully' });
    } catch (error) {
        next(error);
    }
};