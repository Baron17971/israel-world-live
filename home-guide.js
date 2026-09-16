(function () {
  'use strict';

  function enhanceHome() {
    var roles = document.querySelector('.roles');
    var teacher = document.getElementById('teacherRole');
    var student = document.getElementById('studentRole');
    if (!roles || !teacher) return;

    if (student && student.parentNode) student.parentNode.removeChild(student);

    roles.style.gridTemplateColumns = '1fr';
    roles.style.maxWidth = '760px';

    if (teacher.getAttribute('data-teacher-guide') === '1') return;
    teacher.setAttribute('data-teacher-guide', '1');
    teacher.style.cursor = 'pointer';
    teacher.style.padding = '26px';

    teacher.innerHTML = '' +
      '<div class="ico">▥</div>' +
      '<b>ניהול הפעילות למורה</b>' +
      '<span style="display:block;line-height:1.6;margin-top:8px">פותחים כיתה ומציגים לתלמידים את קוד הכניסה או ה־QR. התלמידים נכנסים ישירות למסך הפעילות — אין צורך לשלוח להם את הקישור הזה.</span>' +
      '<span style="display:block;line-height:1.6;margin-top:8px">במהלך השיעור בוחרים את השלב הפעיל, פותחים וסוגרים הצבעה וחושפים תוצאות בזמן אמת.</span>' +
      '<span style="display:block;line-height:1.6;margin-top:8px">אותו קוד מלווה את הכיתה לאורך כל ארבעת השלבים.</span>' +
      '<span style="display:inline-block;margin-top:18px;padding:11px 18px;border-radius:13px;color:white;background:linear-gradient(135deg,var(--b),#25ace6);font-weight:900">פתיחת כיתה</span>';
  }

  var observer = new MutationObserver(function () {
    window.requestAnimationFrame(enhanceHome);
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
  enhanceHome();
})();
