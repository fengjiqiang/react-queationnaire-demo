/**
 * dataSource
 * columns
 * ...
*/

import { Component } from 'react'
import { Table, } from 'antd';
import { LoadingOutlined } from '@ant-design/icons'
import RLPagination from './RLPagination.js';
class RLTable extends Component {
    render() {
        if (this.props.loading) {
            return (
                <div
                    className={this.props.className ? this.props.className + ' rl-table' : 'rl-table'}
                    style={{ ...this.props.style }}>

                    <div className='loading-container'>
                        <LoadingOutlined style={{ width: 24, height: 24 }} />
                    </div>
                </div>
            )
        } else {
            return (
                <div
                    className={this.props.className ? this.props.className + ' rl-table' : 'rl-table'}
                    style={{ ...this.props.style }}>
                    <Table  {...this.props}
                        // loading={true}
                        pagination={false}
                        rowClassName={() => {
                            if (this.props.rowClassName) {
                                return 'rl-table-row ' + this.props.rowClassName
                            } else {
                                return 'rl-table-row'
                            }
                        }}
                    >
                    </Table>
                    {(this.props.paginationInfo && !this.props.pagination) && (
                        <RLPagination
                            showSizeChanger={false}
                            {...this.props.paginationInfo}
                            style={{ marginTop: 12, marginBottom: 12, textAlign: 'right' }}
                            hideOnSinglePage={true}
                        />
                    )}
                </div>
            )
        }

    }
}
export default RLTable