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
import {Button, Card, Col, Input, Row, Select} from "antd";
import * as ChatBackend from "./backend/ChatBackend";
import * as Setting from "./Setting";
import i18next from "i18next";

const {Option} = Select;

class ChatEditPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      chatName: props.match.params.chatName,
      chat: null,
      // users: [],
    };
  }

  UNSAFE_componentWillMount() {
    this.getChat();
    // this.getUser();
  }

  getChat() {
    ChatBackend.getChat(this.props.account.name, this.state.chatName)
      .then((chat) => {
        if (chat.status === "ok") {
          this.setState({
            chat: chat.data,
          });
        } else {
          Setting.showMessage("error", `Failed to get chat: ${chat.msg}`);
        }
      });
  }

  parseChatField(key, value) {
    if ([""].includes(key)) {
      value = Setting.myParseInt(value);
    }
    return value;
  }

  updateChatField(key, value) {
    value = this.parseChatField(key, value);

    const chat = this.state.chat;
    chat[key] = value;
    this.setState({
      chat: chat,
    });
  }

  renderChat() {
    return (
      <Card size="small" title={
        <div>
          {i18next.t("chat:Edit Chat")}&nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="primary" onClick={this.submitChatEdit.bind(this)}>{i18next.t("general:Save")}</Button>
        </div>
      } style={(Setting.isMobile()) ? {margin: "5px"} : {}} type="inner">
        {/* <Row style={{marginTop: "10px"}} >*/}
        {/*  <Col style={{marginTop: "5px"}} span={(Setting.isMobile()) ? 22 : 2}>*/}
        {/*    {Setting.getLabel(i18next.t("general:Organization"), i18next.t("general:Organization - Tooltip"))} :*/}
        {/*  </Col>*/}
        {/*  <Col span={22} >*/}
        {/*    <Select virtual={false} disabled={!Setting.isAdminUser(this.props.account)} style={{width: "100%"}} value={this.state.chat.organization} onChange={(value => {this.updateChatField("organization", value);})}*/}
        {/*      options={this.state.organizations.map((organization) => Setting.getOption(organization.name, organization.name))*/}
        {/*      } />*/}
        {/*  </Col>*/}
        {/* </Row>*/}
        <Row style={{marginTop: "10px"}} >
          <Col style={{marginTop: "5px"}} span={(Setting.isMobile()) ? 22 : 2}>
            {i18next.t("general:Name")} :
          </Col>
          <Col span={22} >
            <Input value={this.state.chat.name} onChange={e => {
              this.updateChatField("name", e.target.value);
            }} />
          </Col>
        </Row>
        <Row style={{marginTop: "20px"}} >
          <Col style={{marginTop: "5px"}} span={(Setting.isMobile()) ? 22 : 2}>
            {i18next.t("general:Display name")} :
          </Col>
          <Col span={22} >
            <Input value={this.state.chat.displayName} onChange={e => {
              this.updateChatField("displayName", e.target.value);
            }} />
          </Col>
        </Row>
        <Row style={{marginTop: "20px"}} >
          <Col style={{marginTop: "5px"}} span={(Setting.isMobile()) ? 22 : 2}>
            {i18next.t("chat:Type")} :
          </Col>
          <Col span={22} >
            <Select virtual={false} style={{width: "100%"}} value={this.state.chat.type} onChange={(value => {
              this.updateChatField("type", value);
            })}>
              {
                [
                  {id: "Single", name: i18next.t("chat:Single")},
                  {id: "Group", name: i18next.t("chat:Group")},
                  {id: "AI", name: i18next.t("chat:AI")},
                ].map((item, index) => <Option key={index} value={item.id}>{item.name}</Option>)
              }
            </Select>
          </Col>
        </Row>
        <Row style={{marginTop: "20px"}} >
          <Col style={{marginTop: "5px"}} span={(Setting.isMobile()) ? 22 : 2}>
            {i18next.t("chat:Category")} :
          </Col>
          <Col span={22} >
            <Input value={this.state.chat.category} onChange={e => {
              this.updateChatField("category", e.target.value);
            }} />
          </Col>
        </Row>
        <Row style={{marginTop: "20px"}} >
          <Col style={{marginTop: "5px"}} span={(Setting.isMobile()) ? 22 : 2}>
            {i18next.t("chat:User1")} :
          </Col>
          <Col span={22} >
            <Select virtual={false} style={{width: "100%"}} value={this.state.chat.user1} onChange={(value => {this.updateChatField("user1", value);})}
              options={this.state.chat.users.map((user) => Setting.getOption(`${user}`, `${user}`))
              } />
          </Col>
        </Row>
        <Row style={{marginTop: "20px"}} >
          <Col style={{marginTop: "5px"}} span={(Setting.isMobile()) ? 22 : 2}>
            {i18next.t("chat:User2")} :
          </Col>
          <Col span={22} >
            <Select virtual={false} style={{width: "100%"}} value={this.state.chat.user2} onChange={(value => {this.updateChatField("user2", value);})}
              options={[{label: "None", value: ""}, ...this.state.chat.users.map((user) => Setting.getOption(`${user}`, `${user}`))]
              } />
          </Col>
        </Row>
        <Row style={{marginTop: "20px"}} >
          <Col style={{marginTop: "5px"}} span={(Setting.isMobile()) ? 22 : 2}>
            {i18next.t("chat:Users")} :
          </Col>
          <Col span={22} >
            <Select virtual={false} mode="multiple" style={{width: "100%"}} value={this.state.chat.users}
              onChange={(value => {this.updateChatField("users", value);})}
              options={this.state.chat.users.map((user) => Setting.getOption(`${user}`, `${user}`))}
            />
          </Col>
        </Row>
      </Card>
    );
  }

  submitChatEdit() {
    const chat = Setting.deepCopy(this.state.chat);
    ChatBackend.updateChat(this.state.chat.owner, this.state.chatName, chat)
      .then((res) => {
        if (res.status === "ok") {
          if (res.data) {
            Setting.showMessage("success", "Successfully saved");
            this.setState({
              chatName: this.state.chat.name,
            });
            this.props.history.push(`/chats/${this.state.chat.name}`);
          } else {
            Setting.showMessage("error", "failed to save: server side failure");
            this.updateChatField("name", this.state.chatName);
          }
        } else {
          Setting.showMessage("error", `failed to save: ${res.msg}`);
        }
      })
      .catch(error => {
        Setting.showMessage("error", `failed to save: ${error}`);
      });
  }

  render() {
    return (
      <div>
        {
          this.state.chat !== null ? this.renderChat() : null
        }
        <div style={{marginTop: "20px", marginLeft: "40px"}}>
          <Button type="primary" onClick={this.submitChatEdit.bind(this)}>{i18next.t("general:Save")}</Button>
        </div>
      </div>
    );
  }
}

export default ChatEditPage;
