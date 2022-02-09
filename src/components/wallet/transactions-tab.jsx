import React from "react"

export default function Transactions() {
    return (
        <div className="table-responsive">
            <table className="wallet-transaction-table">
                <thead className="border-0">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Date</th>
                        <th scope="col">Type</th>
                        <th scope="col" className="text-sm-end">
                            Amount
                        </th>
                        <th scope="col" className="text-sm-center">
                            Status
                        </th>
                    </tr>
                </thead>
                <tbody className="pe-3">
                    {[...Array(15).keys()].map((item) => (
                        <tr className="w-sm-100 w-max-content">
                            <td scope="row" className="fw-bold text-success pe-5 pe-sm-0">
                                BSNQ4X
                            </td>
                            <td className="pe-5 pe-sm-0">
                                12 / 27 / 21
                                <br />
                                <div className="text-secondary fs-15px mt-1">21 : 31 : 12</div>
                            </td>
                            <td className="pe-5 pe-sm-0">Withdraw</td>
                            <td className="text-end pe-5 pe-sm-0">
                                2,497.5000
                                <br />
                                <div className="text-secondary fw-bold mt-1 fs-16px">NDB</div>
                            </td>
                            <td className="d-flex align-items-center justify-content-center pe-5 pe-sm-0">
                                <div className="green-bullet me-2"></div>
                                <div>Success</div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
