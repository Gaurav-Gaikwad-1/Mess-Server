const mongoose = require('mongoose');
const CurrentMenu = require('../../models/currentMenus');
const Mess = require('../../models/mess');

exports.getAllMenus = async(req, res) => {
    let currentMessArray = [];
    let finalMenuArray = [];
    await CurrentMenu.find()
        .exec()
        .then(docs => {
            if (docs.length >= 1) {
                //find the required documents using id
                currentMessArray = docs;
            } else {
                res.status(200).json({
                    message: "success",
                    CurrentMenu: "no current menu available"
                })
            }
        }).catch(err => {
            res.status(500).json({
                message: "some error occured while fetching data",
                error: err
            })
        })

    try {
        for (let i = 0; i < currentMessArray.length; i++) {
            let menuObject = {};
            await Mess.findById({ _id: currentMessArray[i].messId })
                .then(doc => {
                    //extract menu by id
                    let tempMenuArray = doc.MenuList;
                    for (let j = 0; j < tempMenuArray.length; j++) {
                        if (String(tempMenuArray[j]._id) === String(currentMessArray[i].menuId)) {
                            let menuIdentificationObject = {
                                postId: currentMessArray[i]._id,
                                messId: currentMessArray[i].messId,
                                menuId: currentMessArray[i].menuId,
                                createdAt: currentMessArray[i].createdAt,
                                updatedAt: currentMessArray[i].updatedAt
                            }
                            console.log(menuIdentificationObject)
                            menuObject = {
                                //identification: currentMessArray[i],
                                identification: menuIdentificationObject,
                                messDetails: doc.messDetails,
                                menu: tempMenuArray[j]
                            }
                            finalMenuArray.push(menuObject)
                            break;
                        }
                    }
                })
        }

        res.status(200).json({
            message: "success",
            availableMenus: finalMenuArray
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "some error occured while fetching data",
            error: error
        })
    }
}

exports.getMenuById = async(req, res) => {
    let messid = 0;
    let menuid = 0;
    await CurrentMenu.findById({
            _id: req.params.id
        }).exec()
        .then(doc => {
            messid = doc.messId;
            menuid = doc.menuId;
        }).catch(err => {
            res.status(500).json({
                message: "some error occured while fetching data",
                error: err
            })
        })

    let menuListArray = []
    let messInfo = {}
    await Mess.findById({ _id: messid })
        .select('MenuList messDetails')
        .then(doc => {
            menuListArray = doc.MenuList
            messInfo = doc.messDetails
        })
        .catch(err => {
            res.status(500).json({
                message: "some error occured while fetching data",
                error: err
            })
        })

    let index = menuListArray.findIndex(menu => {
        return String(menu._id) === String(menuid)
    })

    res.status(200).json({
        message: "success",
        messinfo: messInfo,
        menu: menuListArray[index]
    })
}

exports.postNewMenu = (req, res) => {
    const menu = new CurrentMenu({
        messId: req.body.messId,
        menuId: req.body.menuId,
        _id: new mongoose.Types.ObjectId,
    })
    menu.save()
        .then(doc => {
            addCollectionIdToPostArray(req.body.messId, doc._id)
            let postObject = {
                messId: doc.messId,
                menuId: doc.menuId,
                postId: doc._id,
                createdAt: doc.createdAt,
                updatedAt: doc.updatedAt,
            }
            res.status(200).json({
                message: "success",
                postInfo: postObject
            })
        }).catch(err => {
            res.status(500).json({
                message: "some error occured while storing data",
                error: err
            })
        })
}

async function addCollectionIdToPostArray(messId, postId) {
    let postArray = []
    await Mess.findById({ _id: messId })
        .then(doc => {
            postArray = doc.postedMenu;
        }).catch(err => {
            throw new Error(err)
        })

    let postObject = {
        postId: postId
    }
    postArray.push(postObject);

    await Mess.findByIdAndUpdate({ _id: messId }, { postedMenu: postArray })
        .then(doc => {
            console.log(doc)
        }).catch(err => {
            throw new Error(err)
        })
}

exports.updateCurrentMenuById = (req, res) => {
    var updateOps = req.body;

    for (const ops in updateOps) {
        updateOps[ops.propName] = ops.value;
    }
    CurrentMenu.findByIdAndUpdate({ _id: req.params.id }, { $set: updateOps })
        .exec()
        .then(doc => {
            res.status(200).json({
                message: "success",
                doc: doc
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "some error occured while updating data",
                error: err
            })
        })
}

exports.deleteCurrentMenuById = (req, res) => {
    CurrentMenu.findByIdAndDelete({
        _id: req.params.id
    }).then(result => {
        res.status(200).json({
            message: "success",
            CurrentMenu: result
        })
    }).catch(err => {
        res.status(500).json({
            message: "some error occured while deleting data",
            error: err
        })
    })
}