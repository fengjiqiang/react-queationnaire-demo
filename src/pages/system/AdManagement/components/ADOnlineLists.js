import BaseCmp from '@components/BaseCmp.js'
import { RLButton, RLTable, RLSwitch } from '@components/index.js'
import { unLineADList, showOrHide, sortAD } from '@actions/system/system.js'
import interfaces from '@/api/interfaces'
import { dealTableTime } from '@/libs/utils'
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import { MenuOutlined } from '@ant-design/icons'
import arrayMove from 'array-move'
import './adOnlineLists.less'

const DragHandle = sortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);
const SortableItem = sortableElement(props => <tr {...props} />);
const SortableContainer = sortableContainer(props => <tbody {...props} />);
class ADOnlineLists extends BaseCmp {
    constructor(props) {
        super(props);
        this.type = this.props.type;
        this.state = {
            searchParam: {  // 搜索列表筛选条件
                type: 1
            },
            dataSource: [],
            listLoading: true,      // 获取列表中loading
        };
    }
    componentDidMount() {
        this.getDataList()
    }
    getDataList = () => {
        this.setState({
            listLoading: true,
        })
        unLineADList({
            ...this.state.searchParam
        }).then(res => {
            if (res.code === 200) {
                let newState = {
                    dataSource: res.data
                }
                this.setState(newState)
            } else {
                this.showToast({ type: 'error', content: res.msg })
            }
        }).finally(() => {
            this.setState({
                listLoading: false,
            })
        })
    }
    getColumns = () => {
        let columns = [
            {
                title: '排序',
                dataIndex: 'sort',
                width: 80,
                className: 'drag-visible',
                render: () => <DragHandle />,
            },
            {
                title: '序号',
                key: 'id',
                width: '9%',
                render: (text, record, index) => `${index + 1}`
            },
            {
                title: '标题',
                dataIndex: 'title',
                key: 'title'
            },
            {
                title: '时间',
                key: 'start_at',
                width: 200,
                render: (record) => {
                    return <div>
                        <div>上线:{record.start_at}</div>
                        <div>下线:{record.end_at}</div>
                    </div>
                }
            },
            {
                title: '图片关联',
                key: 'argue_type',
                render: (record) => {
                    if (record.argue_type == 1) {
                        return '会议'
                    } else if (record.argue_type == 2) {
                        return '直播'
                    } else if (record.argue_type == 3) {
                        return '链接地址'
                    } else if (record.argue_type == 4) {
                        return '点播'
                    }
                }
            },
            // {
            //     title: '点击次数',
            //     dataIndex: 'click_count',
            //     key: 'click_count'
            // },
            {
                title: '创建时间',
                dataIndex: 'created_at',
                key: 'created_at'
            },
            {
                title: '创建者',
                dataIndex: 'creator',
                key: 'creator'
            },
            {
                title: '操作',
                key: 'selfDoIt',
                width: 50,
                render: (record) => {
                    return <div style={{
                        display: 'flex'
                    }}>
                        <RLButton
                            type='link'
                            key={'check'}
                            label={'查看'}
                            onClick={(e) => {
                                this.props.showDetail && this.props.showDetail(record.id)
                            }}
                        />
                    </div>
                }
            }
        ]
        columns.splice(4, 0, {
            title: '上线/下线',
            key: 'is_show',
            width: 100,
            render: (record) => {
                return <RLSwitch
                    defaultChecked={record.is_show === 1}
                    checked={record.is_show === 1}
                    onClick={e => {
                        console.log(e)
                        if (!interfaces.SYSTEM_AD_UNUP) {
                            this.showToast({ type: 'error', content: '您没有此权限' })
                        } else {
                            showOrHide({
                                is_show: e ? 1 : 0,
                                id: record.id
                            }).then(res => {
                                this.getDataList()
                            })
                        }
                    }}
                />
            }
        })
        return columns
    }
    DraggableContainer = props => (
        <SortableContainer
            useDragHandle
            disableAutoscroll
            helperClass="row-dragging"
            onSortEnd={this.onSortEnd}
            {...props}
        />
    );
    DraggableBodyRow = ({ className, style, ...restProps }) => {
        const { dataSource } = this.state;
        const index = dataSource.findIndex(x => x.id === restProps['data-row-key']);
        return <SortableItem index={index} {...restProps} />;
    }
    onSortEnd = ({ oldIndex, newIndex }) => {
        const { dataSource } = this.state;
        if (oldIndex !== newIndex) {
            const newData = arrayMove([].concat(dataSource), oldIndex, newIndex).filter(el => !!el);
            console.log('Sorted items: ', newData);
            this.moveAD(newData);
            //this.setState({ dataSource: newData });
        }
    }
    moveAD = (dataSource) => {
        let sort = [];
        dataSource.forEach((ele, index) => {
            sort[index] = {};
            sort[index].id = ele.id;
            sort[index].rank = (dataSource.length - index) * 10;
        })
        sortAD({ sort: [...sort] }).then(res => {
            console.log(res, '排序成功')
            if (res.code == 200) {
                this.getDataList()
            } else {
                this.showToast(res.msg)
            }
        })
    }
    render() {
        return (
            <div style={{ position: 'relative' }} className="ADonline">
                <RLTable
                    loading={this.state.listLoading}
                    dataSource={this.state.dataSource}
                    rowKey='id'
                    columns={this.getColumns()}
                    pagination={false}
                    components={{
                        body: {
                            wrapper: this.DraggableContainer,
                            row: this.DraggableBodyRow,
                        },
                    }}
                />
            </div>
        )
    }
}
export default ADOnlineLists