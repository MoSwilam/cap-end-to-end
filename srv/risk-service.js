const cds = require('@sap/cds')

/**
 * Implementation for Risk Management service defined in ./risk-service.cds
 */
module.exports = cds.service.impl(async function() {
    this.after('READ', 'Risks', risksData => {
        const risks = Array.isArray(risksData) ? risksData : [risksData];
        risks.forEach(risk => {
            if (risk.impact >= 100000) {
                risk.criticality = 1;
            } else {
                risk.criticality = 2;
            }
        });
    });

    const bupa = await cds.connect.to('API_BUSINESS_PARTNER');

    this.on('READ', 'Suppliers', async req => {
        // are we going to delegate requests to the external service?
        return bupa.run(req.query);
    });
});