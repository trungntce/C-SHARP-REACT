import React from "react";
import { Card } from "reactstrap";
import {users} from "../../common/data/analytics";

const Widget = () => {
    return (
        <React.Fragment>
            <Card>
                <div>
                    <ul className="list-group list-group-flush">
                    {(users || []).map((user: any, key: number) => (
                        <li className="list-group-item" key={key}>
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0 me-3">
                                    <div className="avatar-sm">
                                        <div className="avatar-title rounded-circle font-size-12">
                                            <i className={user["icon"]}></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-grow-1">
                                    <p className="text-muted mb-1">{user["title"]}</p>
                                    <h5 className="font-size-16 mb-0">{user["counting"]}</h5>
                                </div>
                                <div className="flex-shrink-0 align-self-end">
                                    <div className={user["badge"]}>{user["percentage"]} % <i className={user["badgeicon"] + " ms-1"}></i></div>
                                </div>
                            </div>
                        </li>
                         ))}
                    </ul>
                </div>
            </Card>
        </React.Fragment>
    );
};

export default Widget;