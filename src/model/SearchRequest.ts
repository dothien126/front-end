export class SearchRequest {
  fullConversation = 0;
  offset = '0';
  limit = '50';
  filter = '';
  sortBy = 'dateDesc'; // none|dateAsc|dateDesc|subjAsc|subjDesc|nameAsc|nameDesc|rcptAsc|rcptDesc|attachAsc|attachDesc|flagAsc|flagDesc| priorityAsc|priorityDesc|idAsc|idDesc|readAsc|readDesc
  locale = 'en_US';
  types = 'conversation'; // conversation|message|contact|appointment|task|wiki|document
  recip = '';
  path = ''; //client only
  cursor: ICursor = {id: 0, endSortVal: '', sortVal: ''};
}

export class ICursor{
  id = 0;
  sortVal = '';
  endSortVal = '';
}
