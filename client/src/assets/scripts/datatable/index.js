import * as $ from 'jquery';
import 'datatables';

export default (function () {
  $('#dataTable').DataTable({
    "language": {
      "search": "البحث",
      "info": "صفحه رقم _PAGE_ من _PAGES_",
      "lengthMenu":     "اظهار _MENU_ تقرير",
      searchPlaceholder: '...ابحث عن تقرير',
      "paginate": {
            first:    'الأول',
            previous: 'السابق',
            next:     'التالي',
            last:     'الأخير'
        },
        "aria": {
          "paginate": {
              first:    'الأول',
              previous: 'السابق',
              next:     'التالي',
              last:     'الأخير'
          },
        },
    }
  });
  $('#marketsTable').DataTable({
    paging: false,
    // 'pageLength': 5,
    // "lengthMenu": [ 5, 10, 15, 20, 25 ],
    "language": {
      "search": " ",
      "info": ' ',
      "lengthMenu":     "اظهار _MENU_ ماركت",
      searchPlaceholder: '... بحث عن ماركت',
      "paginate": {
            first:    'الأول',
            previous: 'السابق',
            next:     'التالي',
            last:     'الأخير'
        },
        "aria": {
          "paginate": {
              first:    'الأول',
              previous: 'السابق',
              next:     'التالي',
              last:     'الأخير'
          },
        },
    }
  });
  $('#usersTable').DataTable({
    'pageLength': 10,
    "lengthMenu": [ 5, 10, 15, 20, 25 ],
    "language": {
      "search": " ",
      "info": ' ',
      "lengthMenu":     "اظهار _MENU_ مستخدم",
      searchPlaceholder: '... بحث عن مستخدم',
      "paginate": {
            first:    'الأول',
            previous: 'السابق',
            next:     'التالي',
            last:     'الأخير'
        },
        "aria": {
          "paginate": {
              first:    'الأول',
              previous: 'السابق',
              next:     'التالي',
              last:     'الأخير'
          },
        },
    }
  });
}())
