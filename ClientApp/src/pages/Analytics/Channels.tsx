import React, { useState } from "react";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Table, CardBody, Card } from "reactstrap";
import { channels } from "../../common/data/analytics";

const Channels = () => {
    const [menu1, setMenu1] = useState<boolean>(false);

    return (
        <React.Fragment>
            <Card className="card-h-100">
                <CardBody>
                    <div className="d-flex align-items-start">
                        <div className="flex-grow-1 overflow-hidden">
                            <h5 className="card-title text-truncate mb-3">Channels</h5>
                        </div>

                        <div className="flex-shrink-0">
                            <Dropdown
                                isOpen={menu1}
                                toggle={() => setMenu1(!menu1)}
                            >
                                <DropdownToggle tag="a" className="text-reset">
                                    <span className="fw-semibold">Report By:</span> <span className="text-muted">Monthly<i className="mdi mdi-chevron-down ms-1"></i></span>
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
                        <Table className="mb-0">
                            <thead>
                                <tr>
                                    <th scope="col">Sources</th>
                                    <th scope="col">Sessions</th>
                                    <th scope="col">Users</th>
                                    <th scope="col" style={{ width: "25%" }}>Bounce Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(channels || []).map((channel: any, key: number) => (
                                    <tr key={key}>
                                        <th scope="row">{channel["source"]}</th>
                                        <td>{channel["session"]}</td>
                                        <td>{channel["users"]}</td>
                                        <td><div className="text-success text-nowrap">{channel["bouncerate"]}%</div></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </CardBody>
            </Card>
        </React.Fragment>
    );
};

export default Channels;