import React, { useState } from "react";
import SimpleBar from "simplebar-react";
import {
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Row,
    UncontrolledDropdown,
    Card,
    Dropdown,
    Form,
    Input
} from "reactstrap";
import { Link } from "react-router-dom";

import avatar1 from "../../assets/images/users/avatar-1.jpg";
import avatar2 from "../../assets/images/users/avatar-2.jpg";
import img1 from "../../assets/images/small/img-1.jpg";
import img2 from "../../assets/images/small/img-2.jpg"


const Chats = () => {
    const [search_Menu, setsearch_Menu] = useState<boolean>(false);
    const toggleSearch = () => {
        setsearch_Menu(!search_Menu);
    };

    return (
        <React.Fragment>
            <Card>
                <div className="p-3 px-lg-4 border-bottom">
                    <Row>
                        <div className="col-xl-4 col-7">
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0 avatar me-3 d-sm-block d-none">
                                    <img src={avatar2} alt="" className="img-thumbnail d-block rounded-circle" />
                                </div>
                                <div className="flex-grow-1">
                                    <h5 className="font-size-14 mb-1 text-truncate"><Link to="#" className="text-dark">Daniel Pickering</Link></h5>
                                    <p className="text-muted text-truncate mb-0">Online</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-8 col-5">
                            <ul className="list-inline user-chat-nav text-end mb-0">
                                <li className="list-inline-item">
                                    <Dropdown isOpen={search_Menu} toggle={toggleSearch}>
                                        <DropdownToggle className="btn nav-btn" tag="button">
                                            <i className="uil uil-search" />
                                        </DropdownToggle>
                                        <DropdownMenu className="dropdown-menu-end dropdown-menu-md p-2">
                                            <Form className="px-2">
                                                <div>
                                                    <Input
                                                        type="text"
                                                        className="form-control bg-light rounded"
                                                        placeholder="Search ..."
                                                        aria-label="Recipient's username"
                                                    />
                                                </div>
                                            </Form>
                                        </DropdownMenu>
                                    </Dropdown>
                                </li>

                                <li className="list-inline-item">
                                    <UncontrolledDropdown>
                                        <DropdownToggle
                                            href="#"
                                            tag="button"
                                            className="btn nav-btn"
                                        >
                                            <i className="uil uil-ellipsis-h"></i>
                                        </DropdownToggle>
                                        <DropdownMenu className="dropdown-menu-end">
                                            <DropdownItem href="#">Profile</DropdownItem>
                                            <DropdownItem href="#">Archive</DropdownItem>
                                            <DropdownItem href="#">Muted</DropdownItem>
                                            <DropdownItem href="#">Delete</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </li>

                            </ul>

                        </div>
                    </Row>
                </div>
                <div>
                    <SimpleBar className="chat-conversation p-3 px-2 widget-chat">
                        <ul className="list-unstyled mb-0">
                            <li className="chat-day-title">
                                <div className="title">Today</div>
                            </li>
                            <li>
                                <div className="conversation-list">
                                    <div className="ctext-wrap">
                                        <div className="chat-avatar">
                                            <img src={avatar2} alt="avatar-2" />
                                        </div>
                                        <div className="ctext-wrap-content">
                                            <h5 className="conversation-name"><Link to="#" className="user-name">Daniel Pickering</Link> <span className="time">10:00</span></h5>
                                            <p className="mb-0">Good morning !</p>
                                        </div>

                                        <UncontrolledDropdown className="align-self-start">
                                            <DropdownToggle
                                                href="#"
                                                tag="a"
                                                className="dropdown-toggle"
                                            >
                                                <i className="uil uil-ellipsis-v" />
                                            </DropdownToggle>
                                            <DropdownMenu direction="right">
                                                <DropdownItem to="#">Copy</DropdownItem>
                                                <DropdownItem to="#">Save</DropdownItem>
                                                <DropdownItem to="#">
                                                    Forward
                                                </DropdownItem>
                                                <DropdownItem to="#">Delete</DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </div>
                            </li>


                            <li className="right">
                                <div className="conversation-list">
                                    <div className="ctext-wrap">
                                        <div className="chat-avatar">
                                            <img src={avatar1} alt="avatar-1" />
                                        </div>
                                        <div className="ctext-wrap-content">
                                            <h5 className="conversation-name"><Link to="#" className="user-name">Kate</Link> <span className="time">10:02</span></h5>
                                            <p className="mb-0">Good morning</p>
                                        </div>
                                        <UncontrolledDropdown className="align-self-start">
                                            <DropdownToggle
                                                href="#"
                                                tag="a"
                                                className="dropdown-toggle"
                                            >
                                                <i className="uil uil-ellipsis-v" />
                                            </DropdownToggle>
                                            <DropdownMenu direction="right">
                                                <DropdownItem to="#">Copy</DropdownItem>
                                                <DropdownItem to="#">Save</DropdownItem>
                                                <DropdownItem to="#">
                                                    Forward
                                                </DropdownItem>
                                                <DropdownItem to="#">Delete</DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </div>
                            </li>


                            <li>
                                <div className="conversation-list mb-0">
                                    <div className="ctext-wrap">
                                        <div className="chat-avatar">
                                            <img src={avatar2} alt="avatar-2" />
                                        </div>
                                        <div className="ctext-wrap-content">
                                            <h5 className="conversation-name"><Link to="#" className="user-name">Daniel Pickering</Link> <span className="time">10:04</span></h5>
                                            <p className="mb-0">
                                                Hello!
                                            </p>
                                        </div>
                                        <UncontrolledDropdown className="align-self-start">
                                            <DropdownToggle
                                                href="#"
                                                tag="a"
                                                className="dropdown-toggle"
                                            >
                                                <i className="uil uil-ellipsis-v" />
                                            </DropdownToggle>
                                            <DropdownMenu direction="right">
                                                <DropdownItem to="#">Copy</DropdownItem>
                                                <DropdownItem to="#">Save</DropdownItem>
                                                <DropdownItem to="#">
                                                    Forward
                                                </DropdownItem>
                                                <DropdownItem to="#">Delete</DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>

                                    <div className="ctext-wrap">
                                        <div className="chat-avatar">
                                            <img src={avatar2} alt="avatar-2" />
                                        </div>
                                        <div className="ctext-wrap-content">
                                            <h5 className="conversation-name"><Link to="#" className="user-name">Daniel Pickering</Link> <span className="time">10:04</span></h5>
                                            <p className="mb-0">
                                                What about our next meeting?
                                            </p>
                                        </div>
                                        <UncontrolledDropdown className="align-self-start">
                                            <DropdownToggle
                                                href="#"
                                                tag="a"
                                                className="dropdown-toggle"
                                            >
                                                <i className="uil uil-ellipsis-v" />
                                            </DropdownToggle>
                                            <DropdownMenu direction="right">
                                                <DropdownItem to="#">Copy</DropdownItem>
                                                <DropdownItem to="#">Save</DropdownItem>
                                                <DropdownItem to="#">
                                                    Forward
                                                </DropdownItem>
                                                <DropdownItem to="#">Delete</DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </div>
                            </li>


                            <li>
                                <div className="conversation-list">
                                    <div className="ctext-wrap">
                                        <div className="chat-avatar">
                                            <img src={avatar2} alt="avatar-2" />
                                        </div>
                                        <div className="ctext-wrap-content">
                                            <h5 className="conversation-name"><Link to="#" className="user-name">Daniel Pickering</Link> <span className="time">10:06</span></h5>
                                            <p className="mb-0">
                                                Next meeting tomorrow 10.00AM
                                            </p>
                                        </div>
                                        <UncontrolledDropdown className="align-self-start">
                                            <DropdownToggle
                                                href="#"
                                                tag="a"
                                                className="dropdown-toggle"
                                            >
                                                <i className="uil uil-ellipsis-v" />
                                            </DropdownToggle>
                                            <DropdownMenu direction="right">
                                                <DropdownItem to="#">Copy</DropdownItem>
                                                <DropdownItem to="#">Save</DropdownItem>
                                                <DropdownItem to="#">
                                                    Forward
                                                </DropdownItem>
                                                <DropdownItem to="#">Delete</DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </div>
                            </li>


                            <li className="right">
                                <div className="conversation-list">
                                    <div className="ctext-wrap">
                                        <div className="chat-avatar">
                                            <img src={avatar1} alt="avatar-1" />
                                        </div>
                                        <div className="ctext-wrap-content">
                                            <h5 className="conversation-name"><Link to="#" className="user-name">Kate</Link> <span className="time">10:06</span></h5>
                                            <p className="mb-0">
                                                Wow that&apos;s great
                                            </p>
                                        </div>
                                        <UncontrolledDropdown className="align-self-start">
                                            <DropdownToggle
                                                href="#"
                                                tag="a"
                                                className="dropdown-toggle"
                                            >
                                                <i className="uil uil-ellipsis-v" />
                                            </DropdownToggle>
                                            <DropdownMenu direction="right">
                                                <DropdownItem to="#">Copy</DropdownItem>
                                                <DropdownItem to="#">Save</DropdownItem>
                                                <DropdownItem to="#">
                                                    Forward
                                                </DropdownItem>
                                                <DropdownItem to="#">Delete</DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </div>
                            </li>


                            <li>
                                <div className="conversation-list">
                                    <div className="ctext-wrap">
                                        <div className="chat-avatar">
                                            <img src={avatar2} alt="avatar-2" />
                                        </div>
                                        <div className="ctext-wrap-content">
                                            <h5 className="conversation-name"><Link to="#" className="user-name">Daniel Pickering</Link> <span className="time">10:06</span></h5>
                                            <p className="mb-0">
                                                img-1.jpg & img-2.jpg images for a New Projects
                                            </p>

                                            <div className="message-img mt-3 mb-0">
                                                <div className="message-img-list">
                                                    <Link className="d-inline-block" to="">
                                                        <img src={img1} alt="" className="rounded" />
                                                    </Link>
                                                </div>

                                                <div className="message-img-list">
                                                    <Link className="d-inline-block" to="">
                                                        <img src={img2} alt="" className="rounded" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                        <UncontrolledDropdown className="align-self-start">
                                            <DropdownToggle
                                                href="#"
                                                tag="a"
                                                className="dropdown-toggle"
                                            >
                                                <i className="uil uil-ellipsis-v" />
                                            </DropdownToggle>
                                            <DropdownMenu direction="right">
                                                <DropdownItem to="#">Copy</DropdownItem>
                                                <DropdownItem to="#">Save</DropdownItem>
                                                <DropdownItem to="#">
                                                    Forward
                                                </DropdownItem>
                                                <DropdownItem to="#">Delete</DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </div>
                            </li>

                        </ul>

                    </SimpleBar>
                </div>
                <div className="p-3 chat-input-section">
                    <Row>
                        <div className="col">
                            <div className="position-relative">
                                <input type="text" className="form-control chat-input" placeholder="Enter Message..." />

                            </div>
                        </div>
                        <div className="col-auto">
                            <button type="submit" className="btn btn-primary chat-send w-md"><span className="d-none d-sm-inline-block me-2">Send</span> <i className="mdi mdi-send float-end"></i></button>
                        </div>
                    </Row>
                </div>
            </Card>
        </React.Fragment>
    );
}

export default Chats;