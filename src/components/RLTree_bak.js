
import BaseCmp from '@components/BaseCmp.js'
import RLTreeFolder from './RLTreeFolder.js'
import RLTreeFile from './RLTreeFile.js'
import commonActions from '../store/actions/commonActions.js'
import { connect } from 'react-redux';
import eventBus from '@/libs/EventBus.js'
import { RLInput } from '@components/index.js'


class RLTree extends BaseCmp {
    constructor(props) {
        super(props)
        this.state = {
        }
        this.selected = this.props.selected
        this.initTreeData(this.props.keyword)
        console.log('this.props.allUserInfo:', this.props.allUserInfo)
    }
    componentWillMount() {
        eventBus.addListener('tree_remove_check', (item) => {
            this.treeChecked({ type: 'file', checked: false, targetItem: item })
        })
    }
    componentWillReceiveProps(nextProps,) {
        console.log('nextProps:', nextProps)
        if (nextProps.keyword !== this.props.keyword || nextProps.selected !== this.props.selected) {
            this.selected = nextProps.selected
            this.initTreeData(nextProps.keyword)
        }

    }
    getAllUsers = (keyword) => {
        let treeData = this.props.allUserInfo.list.filter(user => {
            return user.name.includes(keyword)
        })
        return treeData
        // actionUserList.getAllUserList(this.state.keyword).then(res => {
        //     let treeData = [
        //         {
        //             type: 'folder',
        //             name: '选择设备',
        //             checked: false,
        //             id: 'device',
        //             children: []
        //         }, {
        //             type: 'folder',
        //             name: '选择用户',
        //             id: 'user',
        //             children: this.props.allUsernfo.list
        //         }
        //     ]
        //     console.log('treeData:', treeData)
        //     this.setState({
        //         treeData,
        //         userCount: this.props.allUerInfo.count
        //     })

        // })
    }
    initTreeData = (keyword) => {
        let treeData = this.getAllUsers(keyword)
        this.initIndeterminate(treeData)
        commonActions.updateTreeData(treeData)

    }
    // 
    initIndeterminate = (treeData) => {
        console.log('this.selected:', this.selected)
        let checkedChildren = []
        for (let i = 0; i < treeData.length; i++) {
            if (treeData[i].type === 'folder') {
                this.iterInde(treeData[i], checkedChildren)
            } else {
                if (this.selected && this.selected.length) {
                    for (let j = 0; j < this.selected.length; j++) {
                        if (this.selected[j].id === treeData[i].id) {
                            treeData[i].checked = true
                            break
                        }
                    }
                }


                if (treeData[i].checked) {
                    checkedChildren.push(treeData[i])
                }
            }
        }
        return checkedChildren
    }
    iterInde = (child, checkedChildren) => {
        let selected = child.children.filter(item => {
            return item.checked
        })
        if (child.children.length === 0) {
            child.indeterminate = false
            child.checked = false
        } else if (selected.length === child.children.length) {
            child.indeterminate = false
            child.checked = true
        } else {
            child.checked = false
            if (selected.length > 0) {
                child.indeterminate = true
            } else {
                child.indeterminate = false
            }
        }

        for (let i = 0; i < child.children.length; i++) {
            if (child.children[i].type === 'folder') {
                this.iterInde(child.children[i], checkedChildren)
            } else {
                if (this.selected && this.selected.length) {
                    for (let j = 0; j < this.selected.length; j++) {
                        if (this.selected[j].id === child.children[i].id) {
                            child.children[i].checked = true
                            break
                        }
                    }
                }

                if (child.children[i].checked) {
                    checkedChildren.push(child.children[i])
                }
            }
        }
    }
    // 全选
    iterCheckAllFn = ({ item, checkAll, targetItem, isChild }) => {
        if (item.type === 'folder') {
            if (targetItem.id === item.id) {
                isChild = true
            }

            for (let i = 0; i < item.children.length; i++) {
                this.iterCheckAllFn({ item: item.children[i], checkAll, targetItem, isChild })
            }
        }
        if (isChild) {
            item.checked = checkAll
        }
    }
    iterCheckFn = ({ item, checked, targetItem, pFolder }) => {
        if (item.type === 'folder') {
            for (let i = 0; i < item.children.length; i++) {
                this.iterCheckFn({
                    item: item.children[i],
                    checked,
                    targetItem,
                    pFolder: item
                })
            }
        } else if (item.id === targetItem.id) {
            item.checked = checked
            // let selected = pFolder.children.filter(child => {
            //     return child.checked
            // })
            // if(selected.length>0 && selected.length<pFolder.children.length){
            //     pFolder.indeterminate = true
            // }else{
            //     pFolder.indeterminate = false
            // }
        }

    }
    treeChecked = ({ type, checked, targetItem }) => {
        let treeData = JSON.parse(JSON.stringify(this.props.treeData))
        if (type === 'folder') {
            let checkAll = checked
            for (let i = 0; i < treeData.length; i++) {
                this.iterCheckAllFn({
                    item: treeData[i],
                    checkAll,
                    targetItem,
                    isChild: treeData[i].id === targetItem.id
                })
            }
        } else {
            for (let i = 0; i < treeData.length; i++) {
                this.iterCheckFn({
                    item: treeData[i],
                    checked,
                    targetItem,
                    pFolder: null
                })
            }
        }
        let checkedChildren = this.initIndeterminate(treeData)
        commonActions.updateTreeData(treeData)
        this.props.onCheck(checkedChildren)
    }
    getItem = (item) => {
        if (item.type === 'folder') {
            return <RLTreeFolder
                key={item.id}
                item={item}
                treeData={this.props.treeData}
                treeChecked={this.treeChecked}
                checked={item.checked}
            />
        } else if (item.type === 'file') {
            return <RLTreeFile item={item} />
        }
    }
    render() {
        // console.log('this.props.treeData:', this.props.treeData)
        return (
            <div
                className={this.props.className ? this.props.className + ' rl-tree' : 'rl-tree'}
            >
                <div className='child select-origin'>
                    <div className='filter'>
                        <RLInput
                            placeholder='请输入内容'
                            allowClear
                            afterFix='SearchOutlined'
                            style={{ width: 224 }}
                            onChange={(e) => {
                                console.log(e.target.value)
                                this.setState({
                                    keyword: e.target.value
                                })
                            }}
                            afterFixClick={() => {
                                // this.getAllUsers()
                            }}
                        />
                    </div>
                    <div className='origin-data-container'>
                        {
                            this.props.treeData.map(item => {
                                return this.getItem(item)
                            })
                        }
                    </div>

                </div>

            </div>
        )
    }
}
export default connect((store, props) => {
    return {
        ...props,
        treeData: store.storeCommon._treeData,
        allUserInfo: store.userList.allUserInfo
    }
})(RLTree);