public with sharing class DuplicateContact {

    @AuraEnabled(cacheable=true)
    public static List<Contact> findDuplicates(Id contactId) {
        try {
        Contact c = [
            SELECT Id, Name, Email, Phone,Normalised_Phone__c
            FROM Contact
            WHERE Id = :contactId
            LIMIT 1
        ];

       List<Contact> Contacts = new List<Contact>();
        if (String.isNotBlank(c.Email)) {
            Contacts=[
                SELECT Id, Name, Email, Phone
                FROM Contact
                WHERE Id != :c.Id
                AND Email != null
                AND Email = :c.Email
                LIMIT 5
            ];
        }
        else if (String.isNotBlank(c.Normalised_Phone__c)) {
            String normalisedPhone = c.Normalised_Phone__c;

            Contacts=[
                SELECT Id, Name, Email, Phone
                FROM Contact
                WHERE Id != :c.Id
                AND Phone != null
                AND Normalised_Phone__c = :normalisedPhone
                LIMIT 5
            ];
        }

        return Contacts;
    }catch (Exception e) {
            
            throw new AuraHandledException(e.getMessage());    
    }

}
}