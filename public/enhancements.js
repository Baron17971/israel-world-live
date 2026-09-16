(function () {
  'use strict';

  var explanations = {
    'השקיה בטפטוף': {
      answer: 'ישראלי',
      lead: 'פתרון שנולד מתוך מחסור במים והפך את ההשקיה למדויקת וחסכונית.',
      detail: 'שמחה בלאס הבחין שעץ צמח היטב ליד צינור שדלף באיטיות. מכאן התפתח הרעיון להזרים מים ישירות לשורשי הצמח בטיפות מדודות. השיטה חסכה מים, שיפרה יבולים והפכה לאחת מפריצות הדרך המזוהות ביותר עם החקלאות הישראלית.'
    },
    'QR Code': {
      answer: 'לא ישראלי',
      lead: 'הקוד המוכר לנו מכל טלפון נולד דווקא ביפן.',
      detail: 'QR Code פותח ב־1994 בחברת Denso Wave כדי לעקוב במהירות אחרי חלקים בתעשיית הרכב. הוא מדגים עיקרון חשוב בחדשנות: לפעמים פתרון שנוצר לצורך מאוד נקודתי הופך לטכנולוגיה עולמית שמשרתת מיליארדי אנשים.'
    },
    'PillCam': {
      answer: 'ישראלי',
      lead: 'מצלמה זעירה בתוך קפסולה הפכה בדיקה רפואית מורכבת לפשוטה ונגישה יותר.',
      detail: 'גבריאל עידן היה מהדמויות המרכזיות בפיתוח מצלמת הקפסולה של Given Imaging. המטופל בולע קפסולה שמצלמת את מערכת העיכול תוך כדי תנועתה בגוף. הפיתוח שילב מזעור, אופטיקה, תקשורת אלחוטית ורפואה כדי לפתור בעיה רפואית אמיתית.'
    },
    'Bluetooth': {
      answer: 'לא ישראלי',
      lead: 'טכנולוגיית התקשורת האלחוטית לטווח קצר פותחה בשוודיה.',
      detail: 'Bluetooth צמחה בעבודת Ericsson בשנות ה־90, במטרה לחבר התקנים ללא כבלים. היא הפכה לסטנדרט עולמי שמחבר אוזניות, מחשבים, רכבים, שעונים וחיישנים — דוגמה לאופן שבו תקן טכנולוגי יכול לשנות הרגלים יומיומיים.'
    },
    'Mobileye': {
      answer: 'ישראלי',
      lead: 'מכונית שלומדת לראות את הכביש בעזרת מצלמה ואלגוריתמים.',
      detail: 'Mobileye נוסדה בירושלים על ידי אמנון שעשוע וזיו אבירם. החברה פיתחה מערכות ראייה ממוחשבת שמזהות כלי רכב, הולכי רגל, נתיבים וסכנות בדרך. הפיתוח הפך לחלק מרכזי ממערכות סיוע לנהג ומהמהפכה של נהיגה אוטונומית.'
    },
    'Post-it': {
      answer: 'לא ישראלי',
      lead: 'אחת ההמצאות המפורסמות בעולם נולדה דווקא מכישלון לכאורה.',
      detail: 'בחברת 3M האמריקאית פותח דבק חלש שלא התאים למטרה המקורית. במקום לזרוק את הרעיון, נמצאה לו שימושיות חדשה — פתקיות שנדבקות וניתנות להסרה שוב ושוב. זו דוגמה מצוינת לכך שחדשנות יכולה להתחיל גם מתוצאה שלא תכננו.'
    },
    'כיפת ברזל': {
      answer: 'ישראלי',
      lead: 'מערכת שנועדה לזהות איום בזמן אמת ולהחליט במהירות אם נדרש יירוט.',
      detail: 'כיפת ברזל פותחה בישראל בהובלת רפאל ובשיתוף מערכת הביטחון. האתגר היה לא רק ליירט רקטות קצרות טווח, אלא גם לחשב את מסלולן ולבחור במהירות אילו מהן מאיימות על אזור מיושב. הפיתוח משלב מכ״ם, תוכנה, קבלת החלטות ויירוט.'
    },
    'GPS': {
      answer: 'לא ישראלי',
      lead: 'מערכת הניווט הלוויינית פותחה בארצות הברית.',
      detail: 'GPS נבנתה כמערכת לוויינית שמאפשרת לחשב מיקום מדויק כמעט בכל מקום בעולם. בהמשך השימוש בה הורחב מאוד לצרכים אזרחיים, והיא הפכה לתשתית שמפעילה ניווט, תחבורה, חקלאות, מדידות, משלוחים ועוד.'
    },
    'Check Point / Firewall-1': {
      answer: 'ישראלי',
      lead: 'רעיון ישראלי שהפך את אבטחת הרשת למוצר עולמי.',
      detail: 'Check Point נוסדה ב־1993 על ידי גיל שויד, מריוס נכט ושלמה קרמר. Firewall-1 היה מהפתרונות המסחריים הבולטים שהשתמשו בבדיקת מצב החיבור (Stateful Inspection) כדי להחליט אילו תקשורות לאפשר ואילו לחסום. זה היה צעד משמעותי בהתפתחות אבטחת הסייבר.'
    },
    'בראשית': {
      answer: 'ישראלי',
      lead: 'יוזמה שהתחילה כאתגר קטן והגיעה עד הירח.',
      detail: 'בראשית הייתה חללית ישראלית של SpaceIL והתעשייה האווירית. ב־2019 היא הגיעה אל הירח אך התרסקה במהלך ניסיון הנחיתה. למרות זאת, עצם ההגעה למסלול הירח עם משאבים מוגבלים הפכה אותה לסמל של יוזמה, שאפתנות, למידה מכישלון ועבודת צוות.'
    }
  };

  var stage3VoteSaved = false;

  function enhanceReveal() {
    var reveal = document.querySelector('.reveal');
    var titleEl = document.querySelector('.game h3');
    if (!reveal || !titleEl) return;

    var title = titleEl.textContent.trim();
    var info = explanations[title];
    if (!info) return;
    if (reveal.getAttribute('data-rich-title') === title) return;

    reveal.setAttribute('data-rich-title', title);
    reveal.classList.add('reveal-rich');
    reveal.innerHTML = '' +
      '<div class="reveal-answer">התשובה: <strong>' + info.answer + '</strong></div>' +
      '<h3>' + title + '</h3>' +
      '<p class="reveal-lead">' + info.lead + '</p>' +
      '<div class="reveal-detail"><span>מה חשוב לדעת?</span><p>' + info.detail + '</p></div>';
  }

  function makeStatusClear() {
    var active = document.querySelector('.stage.on');
    var toggle = document.getElementById('toggleStatus');
    if (!active || !toggle) return;
    var stage = Number(active.getAttribute('data-stage'));
    if (stage === 3 || stage === 4) {
      if (toggle.textContent.indexOf('סגירת') >= 0) toggle.textContent = 'סגירת השלב לתלמידים';
      else toggle.textContent = 'פתיחת השלב לתלמידים';
    }
  }

  function showSavedToast() {
    var toastBox = document.getElementById('toast');
    if (!toastBox) return;
    toastBox.textContent = '✓ הבחירה נקלטה';
    toastBox.classList.add('show');
    window.setTimeout(function () { toastBox.classList.remove('show'); }, 1800);
  }

  function enhanceStage3Feedback() {
    var send = document.getElementById('sendMulti');
    if (!send) return;

    var selected = document.querySelectorAll('.vote[data-answer].sel');
    if (!selected.length) stage3VoteSaved = false;

    var feedback = document.getElementById('stage3SavedFeedback');
    if (stage3VoteSaved) {
      send.textContent = 'עדכון הבחירה';
      if (!feedback) {
        feedback = document.createElement('div');
        feedback.id = 'stage3SavedFeedback';
        feedback.className = 'confirm';
        feedback.textContent = '✓ הבחירה נקלטה';
        var buttonsWrap = send.closest('.btns');
        if (buttonsWrap) buttonsWrap.insertAdjacentElement('afterend', feedback);
      }
    } else {
      send.textContent = 'שליחת הבחירה';
      if (feedback && feedback.parentNode) feedback.parentNode.removeChild(feedback);
    }

    Array.prototype.forEach.call(document.querySelectorAll('.vote[data-answer]'), function (button) {
      if (button.getAttribute('data-stage3-feedback-wired') === '1') return;
      button.setAttribute('data-stage3-feedback-wired', '1');
      button.addEventListener('click', function () {
        stage3VoteSaved = false;
        window.requestAnimationFrame(enhanceStage3Feedback);
      });
    });
  }

  function wrapStage3VoteFetch() {
    if (window.__stage3VoteFeedbackWrapped || typeof window.fetch !== 'function') return;
    window.__stage3VoteFeedbackWrapped = true;
    var originalFetch = window.fetch;

    window.fetch = function (input, init) {
      var isStage3Vote = false;
      try {
        var url = typeof input === 'string' ? input : (input && input.url ? input.url : '');
        var method = init && init.method ? String(init.method).toUpperCase() : 'GET';
        if (url.indexOf('/api/room') >= 0 && method === 'POST' && init && typeof init.body === 'string') {
          var payload = JSON.parse(init.body);
          isStage3Vote = payload && payload.action === 'vote' && Array.isArray(payload.answer);
        }
      } catch (e) {}

      var request = originalFetch.apply(window, arguments);
      if (!isStage3Vote) return request;

      return request.then(function (response) {
        stage3VoteSaved = !!response.ok;
        if (response.ok) {
          showSavedToast();
          window.requestAnimationFrame(enhanceStage3Feedback);
        }
        return response;
      }, function (error) {
        stage3VoteSaved = false;
        throw error;
      });
    };
  }

  function enhance() {
    enhanceReveal();
    makeStatusClear();
    enhanceStage3Feedback();
  }

  wrapStage3VoteFetch();

  var observer = new MutationObserver(function () {
    window.requestAnimationFrame(enhance);
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
  enhance();
})();
