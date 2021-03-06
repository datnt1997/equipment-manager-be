const { ObjectId } = require("bson")

let equipments
class EquipmentsDAO {
  static async injectDB(conn) {
    if (equipments) {
      return
    }
    try {
      equipments = await conn.db(process.env.DB_NAME).collection("equipments")
    } catch (e) {
      console.error(`Unable to establish collection handles in equipmentsDAO: ${e}`)
    }
  }

  /**
  * Finds equipment by condition in the `equipments` collection
  * @returns {Array} Returns a array
  */
  static async getEquipments(condition = {}) {
    let cursor;
    try {
      cursor = await equipments.find({ ...condition });
    } catch (e) {
      return [];
    }
    return cursor.toArray();
  }

  /**
  * Finds a equipment by ID in the `equipments` collection
  * @param {string} equipmentID
  * @returns {Object | null} Returns either a single equipment or nothing
  */
  static async getEquipmentByID(equipmentID) {
    // TODO Ticket: User Management
    // Retrieve the user document corresponding with the user's email.
    return await equipments.findOne({ _id: ObjectId(equipmentID) })
  }

  /**
   * Adds a equipment to the `equipments` collection
   * @param {EquipmentInfo} equipmentInfo - The information of the equipment to add
   * @returns {DAOResponse} Returns either a "success" or an "error" Object
   */
  static async addAEquipment(equipmentInfo) {

    try {
      await equipments.insertOne({ ...equipmentInfo })
      return { success: true }
    } catch (e) {
      console.error(`Error occurred while adding new equipment, ${e}.`)
      return { error: e }
    }
  }

  /**
  * Adds a equipment to the `equipments` collection
  * @param {string} equipmentID
  * @param {EquipmentInfo} equipmentInfo - The information of the equipment to update
  * @returns {DAOResponse} Returns either a "success" or an "error" Object
  */
  static async updateAEquipment(equipmentID, equipmentInfo) {
    try {
      await equipments.updateOne(
        { _id: ObjectId(equipmentID) },
        { $set: { ...equipmentInfo } },
      );
      return { success: true }
    } catch (e) {
      console.error(`Error occurred while update a equipment, ${e}.`)
      return { error: e }
    }
  }

  /**
  * Delete a equipment to the `equipments` collection
  * @param {string} equipmentID
  * @returns {DAOResponse} Returns either a "success" or an "error" Object
  */
  static async deleteAEquipment(equipmentID) {
    try {
      await equipments.deleteOne({ _id: ObjectId(equipmentID) })
      return { success: true }
    } catch (e) {
      console.error(`Error occurred while delete a equipment, ${e}.`)
      return { error: e }
    }
  }

}


module.exports = EquipmentsDAO;