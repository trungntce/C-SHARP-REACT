import React, { useState } from 'react';
import { UncontrolledDropdown, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Card, CardBody, Form, Input } from "reactstrap";
import { Link } from 'react-router-dom';

import { OrderData } from "../../common/data/dashboard";

const Orders = () => {
    const [menu1, setMenu1] = useState<boolean>(false);
    const [search_Menu, setsearch_Menu] = useState<boolean>(false);

    //Toggle search
    const toggleSearch = () => {
        setsearch_Menu(!search_Menu);
    };

    return (
        <React.Fragment>
            <Card>
                <CardBody>
                    <div className="d-flex justify-content-between">
                        <h4 className="card-title mb-4">Orders</h4>

                        <div>
                            <Dropdown isOpen={search_Menu} toggle={toggleSearch} className="d-inline">
                                <DropdownToggle className="text-muted me-3 mb-3 align-middle" tag="a">
                                    <i className="bx bx-search font-size-16" />{" "}
                                </DropdownToggle>
                                <DropdownMenu className="dropdown-menu-end p-0 dropdown-menu-lg">
                                    <Form className="p-2">
                                        <div className="search-box">
                                            <div className="position-relative">
                                                <Input
                                                    type="text"
                                                    className="form-control rounded bg-light border-0"
                                                    placeholder="Search ..."
                                                    aria-label="Recipient's username"
                                                />
                                                <i className="bx bx-search font-size-16 search-icon"></i>
                                            </div>
                                        </div>
                                    </Form>
                                </DropdownMenu>
                            </Dropdown>

                            <Dropdown
                                isOpen={menu1}
                                toggle={() => setMenu1(!menu1)}
                                className="d-inline"
                            >
                                <DropdownToggle tag="a" className="text-reset mb-3">
                                    <span className="fw-semibold">Report By:</span> 
                                    <span className="text-muted">Monthly
                                        <i className="mdi mdi-chevron-down ms-1"></i>
                                    </span>
                                </DropdownToggle>
                                    <DropdownMenu className="dropdown-menu-end">
                                    <DropdownItem to="#">Yearly</DropdownItem>
                                    <DropdownItem to="#">Monthly</DropdownItem>
                                    <DropdownItem to="#">Weekly</DropdownItem>
                                    <DropdownItem to="#">Today</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-hover table-nowrap mb-0 align-middle table-check">
                            <thead className="bg-light">
                                <tr>
                                    <th className="rounded-start" style={{ width: "15px" }}>
                                        <div className="form-check">
                                            <input className="form-check-input font-size-16" type="checkbox"
                                                value="" id="checkAll" />
                                            <label className="form-check-label" htmlFor="checkAll"> </label>
                                        </div>
                                    </th>
                                    <th>ID</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Customer</th>
                                    <th>Purchased</th>
                                    <th colSpan={2} className="rounded-end">Revenue</th>
                                </tr>

                            </thead>

                            <tbody>
                                {(OrderData || []).map((order: any, key: number) => (
                                    <tr key={key}>
                                        <td>
                                            <div className="form-check">
                                                <input className="form-check-input font-size-16" type="checkbox"
                                                    value="" id="flexCheckexampleone" />
                                                <label className="form-check-label" htmlFor="flexCheckexampleone">
                                                </label>
                                            </div>
                                        </td>
                                        <td className="fw-medium">
                                            {order['orderno']}
                                        </td>
                                        <td>
                                            {order['date']}
                                        </td>

                                        <td>
                                            <div className="d-flex">
                                                <div className="me-2">
                                                    <i className={order['icon']}></i>
                                                </div>
                                                <div>
                                                    <p className="mb-0">{order['status']}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div className="me-2">
                                                    <img src={order['image']}
                                                        className="avatar-sm img-thumbnail h-auto rounded-circle"
                                                        alt="Error" />
                                                </div>
                                                <div>
                                                    <h5 className="font-size-14 text-truncate mb-0"><Link to="#"
                                                        className="text-reset">{order['name']}</Link>
                                                    </h5>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            {order['purchased']}{" "}
                                            {order['more'] && order['more'] ? <span className='text-muted'>{order['more']}</span> : null}
                                        </td>

                                        <td>
                                            {order['revenue']}
                                        </td>
                                        <td>
                                            <UncontrolledDropdown>
                                                <DropdownToggle className="card-drop" tag="a">
                                                    <i className="mdi mdi-dots-horizontal font-size-18 text-muted"></i>
                                                </DropdownToggle>
                                                <DropdownMenu className="dropdown-menu-end">
                                                    <DropdownItem>
                                                        <i className="mdi mdi-pencil font-size-16 text-success me-1"></i>Edit
                                                    </DropdownItem>

                                                    <DropdownItem>
                                                        <i className="mdi mdi-trash-can font-size-16 text-danger me-1"></i>Delete
                                                    </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </td>
                                    </tr>
                                ))}

                        </tbody>
                    </table>
                </div>
            </CardBody>
        </Card>
        </React.Fragment >
    );
};

export default Orders;