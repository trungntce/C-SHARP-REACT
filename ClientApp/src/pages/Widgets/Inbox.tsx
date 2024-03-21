import React from "react";
import SimpleBar from "simplebar-react";
import {
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    UncontrolledDropdown,
    Card,
} from "reactstrap";
import { Link } from "react-router-dom";

import avatar2 from "../../assets/images/users/avatar-2.jpg"
import avatar3 from "../../assets/images/users/avatar-3.jpg"
import avatar4 from "../../assets/images/users/avatar-4.jpg"

const Inbox = () => {
    return (
        <React.Fragment>
            <Card>
                <div className="card-header border-0">
                    <div className="d-flex align-items-start">
                        <div className="flex-grow-1">
                            <h5 className="card-title">Inbox</h5>
                        </div>

                        <div className="flex-shrink-0">
                            <UncontrolledDropdown>
                                <DropdownToggle
                                    href="#"
                                    tag="a"
                                    className="font-size-16 text-muted"
                                >
                                    <i className="mdi mdi-dots-horizontal"></i>
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem to="#">Action</DropdownItem>
                                    <DropdownItem to="#">Another action</DropdownItem>
                                    <DropdownItem to="#">Something else here</DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </div>
                    </div>
                </div>


                <div className="pb-4">
                    <SimpleBar className="chat-message-list widget-chat-list">
                        <div className="px-4">
                            <ul className="list-unstyled chat-list">
                                <li className="active">
                                    <Link to="#" className="mt-0">
                                        <div className="d-flex align-items-start">

                                            <div className="flex-shrink-0 user-img online align-self-center me-3">
                                                <img src={avatar2} className="rounded-circle avatar-sm" alt="" />
                                                <span className="user-status"></span>
                                            </div>

                                            <div className="flex-grow-1 overflow-hidden">
                                                <h5 className="text-truncate font-size-14 mb-1">Daniel Pickering</h5>
                                                <p className="text-truncate mb-0">Hey! there I&apos;m available</p>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <div className="font-size-11">02 min</div>
                                            </div>
                                        </div>
                                    </Link>
                                </li>

                                <li className="unread">
                                    <Link to="#">
                                        <div className="d-flex align-items-start">
                                            <div className="flex-shrink-0 user-img online align-self-center me-3">
                                                <div className="avatar-sm align-self-center">
                                                    <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                        H
                                                    </span>
                                                </div>
                                                <span className="user-status"></span>
                                            </div>

                                            <div className="flex-grow-1 overflow-hidden">
                                                <h5 className="text-truncate font-size-14 mb-1">Helen Harper</h5>
                                                <p className="text-truncate mb-0">I&apos;ve finished it! See you so</p>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <div className="font-size-11">10 min</div>
                                            </div>

                                            <div className="unread-message">
                                                <span className="badge bg-danger rounded-pill">01</span>
                                            </div>
                                        </div>
                                    </Link>
                                </li>

                                <li>
                                    <Link to="#">
                                        <div className="d-flex align-items-start">
                                            <div className="flex-shrink-0 user-img away align-self-center me-3">
                                                <img src={avatar3} className="rounded-circle avatar-sm" alt="" />
                                                <span className="user-status"></span>
                                            </div>

                                            <div className="flex-grow-1 overflow-hidden">
                                                <h5 className="text-truncate font-size-14 mb-1">Mary Welch</h5>
                                                <p className="text-truncate mb-0">This theme is awesome!</p>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <div className="font-size-11">22 min</div>
                                            </div>
                                        </div>
                                    </Link>
                                </li>

                                <li>
                                    <Link to="#">
                                        <div className="d-flex align-items-start">

                                            <div className="flex-shrink-0 user-img align-self-center me-3">
                                                <img src={avatar4} className="rounded-circle avatar-sm" alt="" />
                                                <span className="user-status"></span>
                                            </div>

                                            <div className="flex-grow-1 overflow-hidden">
                                                <h5 className="text-truncate font-size-14 mb-1">Vicky Garcia</h5>
                                                <p className="text-truncate mb-0">Nice to meet you</p>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <div className="font-size-11">01 Hr</div>
                                            </div>
                                        </div>
                                    </Link>
                                </li>

                                <li>
                                    <Link to="#">
                                        <div className="d-flex align-items-start">

                                            <div className="flex-shrink-0 user-img online align-self-center me-3">
                                                <div className="avatar-sm align-self-center">
                                                    <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                        S
                                                    </span>
                                                </div>
                                                <span className="user-status"></span>
                                            </div>

                                            <div className="flex-grow-1 overflow-hidden">
                                                <h5 className="text-truncate font-size-14 mb-1">Scott Pierce</h5>
                                                <p className="text-truncate mb-0">Wow that&apos;s great</p>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <div className="font-size-11">04 Hrs</div>
                                            </div>
                                        </div>
                                    </Link>
                                </li>

                                <li>
                                    <Link to="#">
                                        <div className="d-flex align-items-start">

                                            <div className="flex-shrink-0 user-img online align-self-center me-3">
                                                <div className="avatar-sm align-self-center">
                                                    <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                        R
                                                    </span>
                                                </div>
                                                <span className="user-status"></span>
                                            </div>

                                            <div className="flex-grow-1 overflow-hidden">
                                                <h5 className="text-truncate font-size-14 mb-1">Ray Little</h5>
                                                <p className="text-truncate mb-0">Hey! there I&apos;m available</p>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <div className="font-size-11">10 Hrs</div>
                                            </div>
                                        </div>
                                    </Link>
                                </li>

                                <li>
                                    <Link to="#">
                                        <div className="d-flex align-items-start">

                                            <div className="flex-shrink-0 user-img online align-self-center me-3">
                                                <div className="avatar-sm align-self-center">
                                                    <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                        R
                                                    </span>
                                                </div>
                                                <span className="user-status"></span>
                                            </div>

                                            <div className="flex-grow-1 overflow-hidden">
                                                <h5 className="text-truncate font-size-14 mb-1">Robert Perez</h5>
                                                <p className="text-truncate mb-0">Thanks</p>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <div className="font-size-11">yesterday</div>
                                            </div>
                                        </div>
                                    </Link>
                                </li>

                                <li>
                                    <Link to="#">
                                        <div className="d-flex align-items-start">
                                            <div className="flex-shrink-0 user-img away align-self-center me-3">
                                                <img src={avatar3} className="rounded-circle avatar-sm" alt="" />
                                                <span className="user-status"></span>
                                            </div>

                                            <div className="flex-grow-1 overflow-hidden">
                                                <h5 className="text-truncate font-size-14 mb-1">Mary Welch</h5>
                                                <p className="text-truncate mb-0">This theme is awesome!</p>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <div className="font-size-11">22 min</div>
                                            </div>
                                        </div>
                                    </Link>
                                </li>

                            </ul>

                        </div>
                    </SimpleBar>

                </div>
            </Card>
        </React.Fragment>
    );
}

export default Inbox;