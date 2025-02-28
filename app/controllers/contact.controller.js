const ContactService = require("../services/contact.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
    if (!req.body?.name) {
        return next(new ApiError(400, "Name can not be empty"));
    }

    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the contact")
        );
    }
};


exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const contactService = new ContactService(MongoDB.client);
        const { name } = req.query;

        if (name) {
            documents = await contactService.findByName(name);
        } else {
            documents = await contactService.find({});
        }
    } catch (error) {
        return next(new ApiError(500, "An error occurred while retrieving contacts"));
    }

    return res.send(documents);
};


// Tìm một contact theo ID
exports.findOne = async (req, res, next) => {
    try {
        // Tạo một instance của ContactService để thao tác với MongoDB
        const contactService = new ContactService(MongoDB.client);
        
        // Gọi phương thức findById() để tìm contact theo ID từ request parameters
        const document = await contactService.findById(req.params.id);

        // Nếu không tìm thấy contact, trả về lỗi 404 - Not Found
        if (!document) {
            return next(new ApiError(404, "Contact not found"));
        }

        // Nếu tìm thấy, trả về contact dưới dạng JSON
        return res.send(document);
    } catch (error) {
        // Xử lý lỗi nếu có vấn đề xảy ra trong quá trình truy vấn database
        return next(
            new ApiError(
                500, 
                `Error retrieving contact with id=${req.params.id}` // Trả về lỗi 500 - Internal Server Error
            )
        );
    }
};


// Cập nhật một contact theo ID được cung cấp trong request
exports.update = async (req, res, next) => {
    // Kiểm tra xem body request có dữ liệu hay không
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update can not be empty"));
    }

    try {
        // Tạo một instance của ContactService để thao tác với MongoDB
        const contactService = new ContactService(MongoDB.client);

        // Gọi phương thức update() để cập nhật contact theo ID
        const document = await contactService.update(req.params.id, req.body);

        // Nếu contact không tồn tại, trả về lỗi 404 - Not Found
        if (!document) {
            return next(new ApiError(404, "Contact not found"));
        }

        // Nếu cập nhật thành công, gửi phản hồi về client
        return res.send({ message: "Contact was updated successfully" });
    } catch (error) {
        // Xử lý lỗi nếu có vấn đề xảy ra trong quá trình cập nhật
        return next(
            new ApiError(
                500,
                `Error updating contact with id=${req.params.id}` // Trả về lỗi 500 - Internal Server Error
            )
        );
    }
};


// Xóa một contact theo ID được cung cấp trong request
exports.delete = async (req, res, next) => {
    try {
        // Tạo một instance của ContactService để thao tác với MongoDB
        const contactService = new ContactService(MongoDB.client);

        // Gọi phương thức delete() để xóa contact theo ID
        const document = await contactService.delete(req.params.id);

        // Nếu contact không tồn tại, trả về lỗi 404 - Not Found
        if (!document) {
            return next(new ApiError(404, "Contact not found"));
        }

        // Nếu xóa thành công, gửi phản hồi về client
        return res.send({ message: "Contact was deleted successfully" });
    } catch (error) {
        // Xử lý lỗi nếu có vấn đề xảy ra trong quá trình xóa contact
        return next(
            new ApiError(
                500,
                `Could not delete contact with id=${req.params.id}` // Trả về lỗi 500 - Internal Server Error
            )
        );
    }
};


// Xóa tất cả contacts của user trong database
exports.deleteAll = async (_req, res, next) => {
    try {
        // Tạo một instance của ContactService để thao tác với MongoDB
        const contactService = new ContactService(MongoDB.client);

        // Gọi phương thức deleteAll() để xóa tất cả contacts
        const deletedCount = await contactService.deleteAll();

        // Trả về phản hồi với số lượng contact đã bị xóa
        return res.send({
            message: `${deletedCount} contacts were deleted successfully`,
        });
    } catch (error) {
        // Xử lý lỗi nếu có vấn đề xảy ra trong quá trình xóa dữ liệu
        return next(
            new ApiError(500, "An error occurred while removing all contacts")
        );
    }
};


// Tìm tất cả các contact được đánh dấu là "favorite"
exports.findAllFavorite = async (_req, res, next) => {
    try {
        // Tạo một instance của ContactService để thao tác với MongoDB
        const contactService = new ContactService(MongoDB.client);

        // Gọi phương thức findFavorite() để lấy danh sách contact yêu thích
        const documents = await contactService.findFavorite();

        // Trả về danh sách contact yêu thích dưới dạng JSON
        return res.send(documents);
    } catch (error) {
        // Xử lý lỗi nếu có vấn đề xảy ra trong quá trình truy vấn
        return next(
            new ApiError(
                500, // HTTP Status Code: Internal Server Error
                "An error occurred while retrieving favorite contacts"
            )
        );
    }
};
