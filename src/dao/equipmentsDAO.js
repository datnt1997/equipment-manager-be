const { ObjectId } = require("bson")

let equipments
class EquipmentsDAO{
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
   static async addEquipment(equipmentInfo) {
  
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
    static async updateEquipment(equipmentID, equipmentInfo) {
      try {
        await equipments.updateOne(
          {_id: ObjectId(equipmentID)},
          {$set: {...equipmentInfo}},
        );
        return { success: true }
      } catch (e) {
        console.error(`Error occurred while update new equipment, ${e}.`)
        return { error: e }
      }
    }
}

module.exports = EquipmentsDAO;