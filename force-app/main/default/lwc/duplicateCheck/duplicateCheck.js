import { LightningElement, api } from 'lwc';
import findDuplicates from '@salesforce/apex/DuplicateContact.findDuplicates';

export default class ContactDuplicateChecker extends LightningElement {
    @api recordId;
    data = [];
    Checked = false;
    isLoading = false;
    error;

    columns = [
        {
            label: 'Name',
            fieldName: 'RedirectName',
            type: 'url',
            typeAttributes: { label: { fieldName: 'Name' }, target: '_blank' }
        },
        { label: 'Email', fieldName: 'Email' },
        { label: 'Phone', fieldName: 'Phone' }
    ];

    handleClick() {
        this.Checked = false;   // reset state before call
        this.isLoading = true;
        this.data = [];

        findDuplicates({ contactId: this.recordId })
            .then(result => {
                this.data = result.map(row => ({
                    ...row,
                    RedirectName: `/lightning/r/Contact/${row.Id}/view`
                }));
                this.error = undefined;
            })
            .catch(error => {
                this.error = error;
                this.data = [];
                console.error('Error:', error);
            })
            .finally(() => {
                this.Checked = true;  // mark as checked
                this.isLoading = false;
            });
    }

    get hasDuplicates() {
        return this.data && this.data.length > 0;
    }

}
