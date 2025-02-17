// Copyright 2023 The casbin Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React from "react";
import {Link} from "react-router-dom";
import {Button, Popconfirm, Table} from "antd";
import moment from "moment";
import * as Setting from "./Setting";
import * as StoreBackend from "./backend/StoreBackend";
import i18next from "i18next";

class StoreListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      stores: null,
    };
  }

  UNSAFE_componentWillMount() {
    this.getStores();
  }

  getStores() {
    StoreBackend.getGlobalStores()
      .then((res) => {
        if (res.status === "ok") {
          this.setState({
            stores: res.data,
          });
        } else {
          Setting.showMessage("error", `Failed to get stores: ${res.msg}`);
        }
      });
  }

  newStore() {
    const randomName = Setting.getRandomName();
    return {
      owner: this.props.account.name,
      name: `store_${randomName}`,
      createdTime: moment().format(),
      displayName: `New Store - ${randomName}`,
      bucket: `bucket-${this.state.stores.length}`,
      domain: "https://cdn.example.com",
      propertiesMap: {},
    };
  }

  addStore() {
    const newStore = this.newStore();
    StoreBackend.addStore(newStore)
      .then((res) => {
        if (res.status === "ok") {
          Setting.showMessage("success", "Store added successfully");
          this.setState({
            stores: Setting.prependRow(this.state.stores, newStore),
          });
        } else {
          Setting.showMessage("error", `Store failed to add: ${res.msg}`);
        }
      })
      .catch(error => {
        Setting.showMessage("error", `Store failed to add: ${error}`);
      });
  }

  deleteStore(i) {
    StoreBackend.deleteStore(this.state.stores[i])
      .then((res) => {
        if (res.status === "ok") {
          Setting.showMessage("success", "Store deleted successfully");
          this.setState({
            stores: Setting.deleteRow(this.state.stores, i),
          });
        } else {
          Setting.showMessage("error", `Store failed to delete: ${res.msg}`);
        }
      })
      .catch(error => {
        Setting.showMessage("error", `Store failed to delete: ${error}`);
      });
  }

  renderTable(stores) {
    const columns = [
      {
        title: i18next.t("general:Name"),
        dataIndex: "name",
        key: "name",
        width: "300px",
        sorter: (a, b) => a.name.localeCompare(b.name),
        render: (text, record, index) => {
          return (
            <Link to={`/stores/${record.owner}/${text}/view`}>
              {text}
            </Link>
          );
        },
      },
      {
        title: i18next.t("general:Display name"),
        dataIndex: "displayName",
        key: "displayName",
        width: "600px",
        sorter: (a, b) => a.displayName.localeCompare(b.displayName),
      },
      {
        title: i18next.t("general:Action"),
        dataIndex: "action",
        key: "action",
        width: "240px",
        render: (text, record, index) => {
          return (
            <div>
              <Button style={{marginTop: "10px", marginBottom: "10px", marginRight: "10px"}} onClick={() => this.props.history.push(`/stores/${record.owner}/${record.name}/view`)}>{i18next.t("general:View")}</Button>
              {
                !Setting.isLocalAdminUser(this.props.account) ? null : (
                  <React.Fragment>
                    <Button style={{marginBottom: "10px", marginRight: "10px"}} type="primary" onClick={() => this.props.history.push(`/stores/${record.owner}/${record.name}`)}>{i18next.t("general:Edit")}</Button>
                    <Popconfirm
                      title={`Sure to delete store: ${record.name} ?`}
                      onConfirm={() => this.deleteStore(index)}
                      okText="OK"
                      cancelText="Cancel"
                    >
                      <Button style={{marginBottom: "10px"}} type="primary" danger>{i18next.t("general:Delete")}</Button>
                    </Popconfirm>
                  </React.Fragment>
                )
              }
            </div>
          );
        },
      },
    ];

    return (
      <div>
        <Table scroll={{x: "max-content"}} columns={columns} dataSource={stores} rowKey="name" size="middle" bordered pagination={{pageSize: 100}}
          title={() => (
            <div>
              {i18next.t("general:Stores")}&nbsp;&nbsp;&nbsp;&nbsp;
              {
                !Setting.isLocalAdminUser(this.props.account) ? null : (
                  <Button type="primary" size="small" onClick={this.addStore.bind(this)}>{i18next.t("general:Add")}</Button>
                )
              }
            </div>
          )}
          loading={stores === null}
        />
      </div>
    );
  }

  render() {
    return (
      <div>
        {
          this.renderTable(this.state.stores)
        }
      </div>
    );
  }
}

export default StoreListPage;
