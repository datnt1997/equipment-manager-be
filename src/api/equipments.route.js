const { Router } = require("express");
const equipmentCtrl = require ("../controller/equipments.controller")

const router = new Router()

// associate put, delete, and get(id)
router.route("/create").post(equipmentCtrl.createEquipment)
// router.route("/update").post(equipmentCtrl.updateEquipment)
router.route("/book-a-equipment").put(equipmentCtrl.bookAEquipment)
router.route("/return-a-equipment").put(equipmentCtrl.returnAEquipment)
// router.route("/delete").delete(equipmentCtrl.deleteEquipment)
// router.route("/getAll").get(equipmentCtrl.getAllEquipments)
router.route("/:id").get(equipmentCtrl.getEquipmentByID)

module.exports = router;
