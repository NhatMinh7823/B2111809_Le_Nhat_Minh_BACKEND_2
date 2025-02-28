const { ObjectId } = require("mongodb");

class ContactService {
    constructor(client) {
        this.Contact = client.db().collection("contacts");
    }
    extractContactData(payload) {
        const contact = {
            name: payload.name,
            email: payload.email,
            address: payload.address,
            phone: payload.phone,
            favorite: payload.favorite,
        };

        // Remove undefined fields
        Object.keys(contact).forEach(
            (key) => contact[key] === undefined && delete contact[key]
        );

        return contact;
    }

    async create(payload) {
        const contact = this.extractContactData(payload);
        const result = await this.Contact.findOneAndUpdate(
            contact,
            { $set: { favorite: contact.favorite === true } },
            { returnDocument: "after", upsert: true }
        );

        return result;
    }

    async find(filter) {
        const cursor = await this.Contact.find(filter);
        return await cursor.toArray();
    }

    async findByName(name) {
        return await this.find({
            name: { $regex: new RegExp(new RegExp(name)), $options: "i" }, 
        });
    }
    async findById(id) {
        return await this.Contact.findOne({
            _id: ObjectId.isValid(id)?new ObjectId(id) : null, 
        });
    }

    async update(id, payload) {
        // Tạo bộ lọc (filter) để tìm contact theo _id
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null, // Kiểm tra ID có hợp lệ không
        };

        // Trích xuất dữ liệu cần cập nhật từ payload (request body)
        const update = this.extractContactData(payload);

        // Tìm và cập nhật contact, trả về document sau khi cập nhật
        const result = await this.Contact.findOneAndUpdate(
            filter,                // Điều kiện tìm kiếm contact
            { $set: update },      // Cập nhật các trường được cung cấp
            { returnDocument: "after" } // Trả về document sau khi cập nhật
        );

        return result; // Trả về contact đã được cập nhật
    }

    async delete(id) {
        // Tìm và xóa contact theo _id
        const result = await this.Contact.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null, // Kiểm tra ID hợp lệ trước khi chuyển thành ObjectId
        });

        return result; // Trả về contact đã bị xóa (hoặc null nếu không tìm thấy)
    }

    async findFavorite() {
        return await this.find({ favorite: true }); // Trả về danh sách các contact yêu thích
    }

    async deleteAll() {
        const result = await this.Contact.deleteMany({}); // Xóa tất cả documents trong collection
        return result.deletedCount; // Trả về số lượng contacts đã bị xóa
    }
}
module.exports = ContactService;
