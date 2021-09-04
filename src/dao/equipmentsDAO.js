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
}

module.exports = EquipmentsDAO;