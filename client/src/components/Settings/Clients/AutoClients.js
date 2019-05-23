import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import ReactTable from 'react-table';

import { CLIENT_ID } from '../../../helpers/constants';
import Card from '../../ui/Card';

class AutoClients extends Component {
    getClient = (name, clients) => {
        const client = clients.find(item => name === item.name);

        if (client) {
            const identifier = client.mac ? CLIENT_ID.MAC : CLIENT_ID.IP;

            return {
                identifier,
                use_global_settings: true,
                ...client,
            };
        }

        return {
            identifier: 'ip',
            use_global_settings: true,
        };
    };

    getStats = (ip, stats) => {
        if (stats && stats.top_clients) {
            return stats.top_clients[ip];
        }

        return '';
    };

    columns = [
        {
            Header: this.props.t('table_client'),
            accessor: 'ip',
            Cell: (row) => {
                if (row.value) {
                    return (
                        <div className="logs__row logs__row--overflow">
                            <span className="logs__text" title={row.value}>
                                {row.value} <em>(IP)</em>
                            </span>
                        </div>
                    );
                } else if (row.original && row.original.mac) {
                    return (
                        <div className="logs__row logs__row--overflow">
                            <span className="logs__text" title={row.original.mac}>
                                {row.original.mac} <em>(MAC)</em>
                            </span>
                        </div>
                    );
                }

                return '';
            },
        },
        {
            Header: this.props.t('table_name'),
            accessor: 'name',
            Cell: ({ value }) => (
                <div className="logs__row logs__row--overflow">
                    <span className="logs__text" title={value}>
                        {value}
                    </span>
                </div>
            ),
        },
        {
            Header: this.props.t('table_statistics'),
            accessor: 'statistics',
            Cell: (row) => {
                const clientIP = row.original.ip;
                const clientStats = clientIP && this.getStats(clientIP, this.props.topStats);

                if (clientStats) {
                    return (
                        <div className="logs__row">
                            <div className="logs__text" title={clientStats}>
                                {clientStats}
                            </div>
                        </div>
                    );
                }

                return '–';
            },
        },
    ];

    render() {
        const { t, autoClients } = this.props;

        return (
            <Card
                title={t('auto_clients_title')}
                subtitle={t('auto_clients_desc')}
                bodyType="card-body box-body--settings"
            >
                <ReactTable
                    data={autoClients || []}
                    columns={this.columns}
                    className="-striped -highlight card-table-overflow"
                    showPagination={true}
                    defaultPageSize={10}
                    minRows={5}
                    previousText={t('previous_btn')}
                    nextText={t('next_btn')}
                    loadingText={t('loading_table_status')}
                    pageText={t('page_table_footer_text')}
                    ofText={t('of_table_footer_text')}
                    rowsText={t('rows_table_footer_text')}
                    noDataText={t('clients_not_found')}
                />
            </Card>
        );
    }
}

AutoClients.propTypes = {
    t: PropTypes.func.isRequired,
    autoClients: PropTypes.array.isRequired,
    topStats: PropTypes.object.isRequired,
};

export default withNamespaces()(AutoClients);
