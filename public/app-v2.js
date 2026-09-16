(function () {
  'use strict';

  var app = document.getElementById('app');
  var toastBox = document.getElementById('toast');
  var pollTimer = null;
  var teacher = null;
  var student = null;
  var projectorOpen = false;

  var stages = [
    {
      title: 'סקר פתיחה',
      question: 'מה חשוב ביותר להצלחה יוצאת דופן?',
      options: ['כישרון', 'התמדה', 'הזדמנות', 'ידע', 'אומץ', 'סקרנות', 'אנשים נכונים סביבי']
    },
    { title: 'ישראלי – מי יודע?' },
    {
      title: 'מה הופך את ישראל לאומת סטארט־אפ?',
      question: 'מה לדעתכם הופך את ישראל לאומת סטארט־אפ?',
      options: ['חינוך ו־STEM', 'צורך ומחסור', 'מחקר ואקדמיה', 'תרבות של יוזמה', 'חיבור בין מערכות ואנשים', 'השקעה ומשאבים', 'חשיבה גלובלית']
    },
    {
      title: 'ומה איתי?',
      question: 'מה הסיכוי שבעוד 10–20 שנה מישהו שיושב עכשיו בכיתה הזאת יהיה האדם שמאחורי פריצת הדרך הבאה?',
      options: ['גבוה מאוד', 'בהחלט אפשרי', 'אולי', 'קשה לי לדמיין']
    }
  ];

  var game = [
    ['השקיה בטפטוף', '💧', 'ישראלי', 'שמחה בלאס זיהה את הפוטנציאל שבהשקיה מדויקת בטיפות. הרעיון התפתח בישראל למערכות ששינו חקלאות בארץ ובעולם.'],
    ['QR Code', '▦', 'לא ישראלי', 'קוד QR פותח ביפן בשנות ה־90 בחברת Denso Wave.'],
    ['PillCam', '◉', 'ישראלי', 'גבריאל עידן היה מהדמויות המרכזיות בפיתוח מצלמת הקפסולה של Given Imaging.'],
    ['Bluetooth', 'ᛒ', 'לא ישראלי', 'Bluetooth צמח מפיתוח של Ericsson בשוודיה.'],
    ['Mobileye', '◉', 'ישראלי', 'Mobileye נוסדה בירושלים בידי אמנון שעשוע וזיו אבירם ופיתחה מערכות ראייה ממוחשבת לנהיגה.'],
    ['Post-it', '▰', 'לא ישראלי', 'פתקיות Post-it פותחו בחברת 3M בארצות הברית.'],
    ['כיפת ברזל', '⌁', 'ישראלי', 'כיפת ברזל פותחה בישראל בהובלת רפאל ובשיתוף גופי ביטחון ותעשייה.'],
    ['GPS', '⌖', 'לא ישראלי', 'GPS פותחה בארצות הברית כמערכת ניווט לוויינית.'],
    ['Check Point / Firewall-1', '◇', 'ישראלי', 'Check Point נוסדה בישראל בידי גיל שויד, מריוס נכט ושלמה קרמר.'],
    ['בראשית', '☾', 'ישראלי', 'בראשית הייתה משימת חלל ישראלית של SpaceIL והתעשייה האווירית והגיעה לירח ב־2019.']
  ];

  function voterId() {
    try {
      var value = localStorage.getItem('israel-world-voter-id');
      if (!value) {
        value = 'v-' + Date.now() + '-' + Math.random().toString(36).slice(2);
        localStorage.setItem('israel-world-voter-id', value);
      }
      return value;
    } catch (e) {
      return 'v-' + Date.now() + '-' + Math.random().toString(36).slice(2);
    }
  }

  var myVoterId = voterId();

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function toast(message) {
    if (!toastBox) return;
    toastBox.textContent = message;
    toastBox.classList.add('show');
    window.setTimeout(function () { toastBox.classList.remove('show'); }, 1800);
  }

  function stopPolling() {
    if (pollTimer) window.clearInterval(pollTimer);
    pollTimer = null;
  }

  function apiError(code) {
    var messages = {
      room_not_found: 'הכיתה לא נמצאה או שפג תוקפה.',
      poll_closed: 'השלב סגור כרגע.',
      teacher_auth_failed: 'אין הרשאת מורה במכשיר הזה.',
      vote_retry: 'הייתה התנגשות רגעית. נסו שוב.'
    };
    return messages[code] || 'משהו לא הסתדר. נסו שוב.';
  }

  function apiGet(code, teacherToken) {
    var params = new URLSearchParams();
    params.set('code', code);
    params.set('voterId', myVoterId);
    if (teacherToken) params.set('teacherToken', teacherToken);
    return fetch('/api/room?' + params.toString(), { cache: 'no-store' }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        if (!res.ok) throw data;
        return data;
      });
    });
  }

  function apiPost(payload) {
    return fetch('/api/room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        if (!res.ok) throw data;
        return data;
      });
    });
  }

  function hero() {
    return '<section class="hero">' +
      '<div style="position:absolute;inset:0;background:radial-gradient(circle at 82% 22%,rgba(255,255,255,.9),transparent 15%),radial-gradient(circle at 18% 75%,rgba(88,205,238,.45),transparent 22%),linear-gradient(135deg,#ccefff 0%,#f7fbff 42%,#fff1c7 100%);"></div>' +
      '<div style="position:absolute;left:7%;top:20%;font-size:clamp(3rem,10vw,7rem);opacity:.13">☾</div>' +
      '<div style="position:absolute;right:8%;top:16%;font-size:clamp(3rem,8vw,6rem);opacity:.13">⌁</div>' +
      '<div style="position:absolute;left:24%;bottom:22%;font-size:clamp(2rem,6vw,4rem);opacity:.18">💧</div>' +
      '<div style="position:absolute;right:25%;bottom:20%;font-size:clamp(2rem,6vw,4rem);opacity:.16">◉</div>' +
      '<div class="shade"></div>' +
      '<div class="herot"><h1>ישראל משנה את העולם</h1><p>פיתוחים ישראליים – מצוינות אישית ולאומית</p></div>' +
      '</section>';
  }

  function renderHome() {
    stopPolling();
    teacher = null;
    student = null;
    try { history.replaceState({}, '', '/'); } catch (e) {}
    app.innerHTML = hero() +
      '<div class="roles">' +
      '<button class="role" id="teacherRole"><div class="ico">▥</div><b>אני מורה</b><span>פתיחת כיתה, QR, שליטה בשלבים ותוצאות חיות.</span></button>' +
      '<button class="role" id="studentRole"><div class="ico">✓</div><b>אני תלמיד/ה</b><span>כניסה אחת לכל הפעילויות של השיעור.</span></button>' +
      '</div>';
    document.getElementById('teacherRole').addEventListener('click', renderCreateClass);
    document.getElementById('studentRole').addEventListener('click', function () { renderJoin(); });
  }

  function renderCreateClass() {
    stopPolling();
    app.innerHTML = hero() +
      '<div class="card form"><h2>פתיחת כיתה</h2><p class="muted">אותו QR וקוד ילוו את הכיתה לאורך כל השיעור.</p>' +
      '<input id="className" class="inp" placeholder="שם הכיתה, למשל י׳3">' +
      '<div class="btns"><button class="btn gh" id="backHome">חזרה</button><button class="btn pri" id="createRoom">פתיחת הפעילות</button></div></div>';
    document.getElementById('backHome').addEventListener('click', renderHome);
    document.getElementById('createRoom').addEventListener('click', function () {
      var button = this;
      button.disabled = true;
      button.textContent = 'פותח/ת כיתה…';
      apiPost({ action: 'create', className: document.getElementById('className').value.trim() })
        .then(function (room) {
          teacher = { code: room.code, token: room.teacherToken, room: room };
          try { localStorage.setItem('iwt-' + room.code, room.teacherToken); } catch (e) {}
          try { history.replaceState({}, '', '/teacher?code=' + room.code); } catch (e) {}
          renderTeacher();
          startTeacherPolling();
        })
        .catch(function (err) {
          toast(apiError(err && err.error));
          button.disabled = false;
          button.textContent = 'פתיחת הפעילות';
        });
    });
  }

  function renderJoin(prefill) {
    stopPolling();
    app.innerHTML = hero() +
      '<div class="card form"><h2>כניסה לפעילות</h2><p class="muted">הקלידו את קוד הכיתה שמופיע אצל המורה.</p>' +
      '<input id="joinCode" class="inp" style="direction:ltr;text-align:center;font-size:2rem;font-weight:900" maxlength="6" inputmode="numeric" value="' + escapeHtml(prefill || '') + '" placeholder="000000">' +
      '<div class="btns"><button class="btn gh" id="backHome">חזרה</button><button class="btn pri" id="joinRoom">כניסה</button></div></div>';
    document.getElementById('backHome').addEventListener('click', renderHome);
    document.getElementById('joinRoom').addEventListener('click', joinRoom);
    document.getElementById('joinCode').addEventListener('keydown', function (e) { if (e.key === 'Enter') joinRoom(); });
  }

  function joinRoom() {
    var code = document.getElementById('joinCode').value.replace(/\D/g, '').slice(0, 6);
    if (code.length !== 6) { toast('הזינו קוד בן 6 ספרות'); return; }
    apiGet(code, '').then(function (room) {
      student = { code: code, room: room };
      try { history.replaceState({}, '', '/join?code=' + code); } catch (e) {}
      renderStudent();
      startStudentPolling();
    }).catch(function (err) { toast(apiError(err && err.error)); });
  }

  function stageNav(room) {
    var labels = ['מה בונה הצלחה?', 'פיתוח ישראלי או לא?', 'מה בנה את האקוסיסטם?', 'האם פריצת הדרך הבאה כאן?'];
    return '<div class="stages">' + stages.map(function (stage, i) {
      return '<button class="stage ' + (room.activeStage === i + 1 ? 'on' : '') + '" data-stage="' + (i + 1) + '"><span class="num">' + (i + 1) + '</span><b>' + escapeHtml(stage.title) + '</b><small>' + labels[i] + '</small></button>';
    }).join('') + '</div>';
  }

  function resultBars(room) {
    var labels = room.activeStage === 2 ? ['ישראלי', 'לא ישראלי'] : stages[room.activeStage - 1].options;
    var results = room.results || { counts: labels.map(function () { return 0; }), total: 0 };
    return '<div class="results">' + labels.map(function (label, i) {
      var count = results.counts[i] || 0;
      var percent = results.total ? Math.round((count / results.total) * 100) : 0;
      return '<div class="rr"><b>' + escapeHtml(label) + '</b><div class="bar"><i style="width:' + percent + '%"></i></div><div class="rv">' + percent + '% · ' + count + '</div></div>';
    }).join('') + '</div>';
  }

  function teacherActive(room) {
    var total = room.results ? room.results.total : 0;
    if (room.activeStage === 2) {
      var item = game[room.gameIndex || 0];
      return '<div class="muted">שאלה ' + ((room.gameIndex || 0) + 1) + ' מתוך 10 · ' + total + ' הצביעו</div><h2>ישראלי – מי יודע?</h2>' +
        '<div class="game"><div class="gico">' + item[1] + '</div><div><h3>' + escapeHtml(item[0]) + '</h3><span class="muted">האם זה פיתוח/מיזם ישראלי?</span></div></div><div style="margin-top:15px">' + resultBars(room) + '</div>' +
        (room.gameRevealed ? '<div class="reveal"><b>' + item[2] + '</b><div>' + escapeHtml(item[3]) + '</div></div>' : '') +
        '<div class="btns"><button class="btn pri" id="toggleStatus">' + (room.status === 'open' ? 'סגירת הצבעה' : 'פתיחת השאלה') + '</button><button class="btn sec" id="revealAnswer">חשיפת תשובה</button><button class="btn gh" id="prevGame">הקודמת</button><button class="btn gh" id="nextGame">הבאה</button><button class="btn danger" id="resetVotes">איפוס</button><button class="btn gh" id="projector">הקרנה</button></div>';
    }
    var stage = stages[room.activeStage - 1];
    return '<span class="pill neutral">' + total + ' הצביעו</span><h2>' + escapeHtml(stage.title) + '</h2><div class="q">' + escapeHtml(stage.question) + '</div>' + resultBars(room) +
      '<div class="btns"><button class="btn pri" id="toggleStatus">' + (room.status === 'open' ? 'סגירת השלב' : 'פתיחת השלב') + '</button><button class="btn sec" id="toggleVisibility">' + (room.resultsVisible ? 'הסתרת תוצאות' : 'הצגת תוצאות') + '</button><button class="btn danger" id="resetVotes">איפוס</button><button class="btn gh" id="projector">הקרנה</button></div>';
  }

  function renderTeacher() {
    if (!teacher || !teacher.room) return;
    var room = teacher.room;
    var joinUrl = location.origin + '/join?code=' + room.code;
    app.innerHTML = hero() + stageNav(room) + '<div class="layout"><div class="card">' + teacherActive(room) + '</div><aside class="card join"><div class="muted"><b>קוד הכיתה</b></div><div class="code">' + room.code + '</div><div class="qr"><img alt="QR לכניסה" src="/api/qr?text=' + encodeURIComponent(joinUrl) + '"></div><div class="copy"><input class="inp" id="joinLink" readonly value="' + escapeHtml(joinUrl) + '"><button class="btn pri" id="copyLink">העתקה</button></div><div style="margin-top:12px"><span class="pill ' + (room.status === 'open' ? 'open' : 'closed') + '">' + (room.status === 'open' ? 'השלב פתוח' : 'השלב סגור') + '</span></div></aside></div>';
    Array.prototype.forEach.call(document.querySelectorAll('.stage'), function (button) { button.addEventListener('click', function () { teacherAction('setStage', { stage: Number(button.getAttribute('data-stage')) }); }); });
    document.getElementById('copyLink').addEventListener('click', function () { var text = document.getElementById('joinLink').value; if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { toast('הקישור הועתק'); }); else { document.getElementById('joinLink').select(); document.execCommand('copy'); toast('הקישור הועתק'); } });
    document.getElementById('toggleStatus').addEventListener('click', function () { teacherAction('setStatus', { status: room.status === 'open' ? 'closed' : 'open' }); });
    document.getElementById('resetVotes').addEventListener('click', function () { if (window.confirm('לאפס תשובות בשלב זה?')) teacherAction('reset', {}); });
    document.getElementById('projector').addEventListener('click', openProjector);
    var vis = document.getElementById('toggleVisibility'); if (vis) vis.addEventListener('click', function () { teacherAction('setVisibility', { resultsVisible: !room.resultsVisible }); });
    var reveal = document.getElementById('revealAnswer'); if (reveal) reveal.addEventListener('click', function () { teacherAction('gameReveal', {}); });
    var next = document.getElementById('nextGame'); if (next) next.addEventListener('click', function () { teacherAction('gameNext', {}); });
    var prev = document.getElementById('prevGame'); if (prev) prev.addEventListener('click', function () { teacherAction('gamePrev', {}); });
  }

  function teacherAction(action, extra) {
    var payload = { action: action, code: teacher.code, teacherToken: teacher.token };
    Object.keys(extra || {}).forEach(function (key) { payload[key] = extra[key]; });
    apiPost(payload).then(function (room) { teacher.room = room; renderTeacher(); updateProjector(); }).catch(function (err) { toast(apiError(err && err.error)); });
  }

  function startTeacherPolling() {
    stopPolling();
    pollTimer = window.setInterval(function () { if (!teacher) return; apiGet(teacher.code, teacher.token).then(function (room) { teacher.room = room; if (!projectorOpen) renderTeacher(); else updateProjector(); }).catch(function () {}); }, 1600);
  }

  function voteButton(label, index, selected) { return '<button class="vote ' + (selected ? 'sel' : '') + '" data-answer="' + index + '">' + escapeHtml(label) + '</button>'; }

  function renderStudent() {
    if (!student || !student.room) return;
    var room = student.room;
    var stage = stages[room.activeStage - 1];
    var body = '';
    if (room.status !== 'open' && !room.gameRevealed) body = '<div class="wait"><b>השלב עדיין לא נפתח.</b><br>השאירו את המסך פתוח — הוא יתעדכן אוטומטית.</div>';
    else if (room.activeStage === 2) {
      var item = game[room.gameIndex || 0];
      if (room.gameRevealed) body = '<div class="game"><div class="gico">' + item[1] + '</div><div><h3>' + escapeHtml(item[0]) + '</h3></div></div><div class="reveal"><b>' + item[2] + '</b><div>' + escapeHtml(item[3]) + '</div></div>' + (room.results ? '<div style="margin-top:16px">' + resultBars(room) + '</div>' : '');
      else body = '<div class="game"><div class="gico">' + item[1] + '</div><div><h3>' + escapeHtml(item[0]) + '</h3><span class="muted">האם זה פיתוח/מיזם ישראלי?</span></div></div><div class="votegrid twos" style="margin-top:14px">' + voteButton('🇮🇱 ישראלי', 0, room.myVote === 0) + voteButton('🌍 לא ישראלי', 1, room.myVote === 1) + '</div>' + (room.myVote !== null && room.myVote !== undefined ? '<div class="confirm">✓ ההצבעה נקלטה</div>' : '');
    } else if (room.activeStage === 3) {
      var selected = Array.isArray(room.myVote) ? room.myVote.slice() : [];
      body = '<div class="q">' + escapeHtml(stage.question) + '</div><div class="muted" style="text-align:center;margin-bottom:10px">בחרו עד שלושה גורמים</div><div class="votegrid">' + stage.options.map(function (label, i) { return voteButton(label, i, selected.indexOf(i) >= 0); }).join('') + '</div><div class="btns" style="justify-content:center"><button class="btn pri" id="sendMulti">שליחת הבחירה</button></div>' + (room.resultsVisible && room.results ? '<div style="margin-top:18px">' + resultBars(room) + '</div>' : '');
      window.setTimeout(function () { wireMulti(selected); }, 0);
    } else body = '<div class="q">' + escapeHtml(stage.question) + '</div><div class="votegrid">' + stage.options.map(function (label, i) { return voteButton(label, i, room.myVote === i); }).join('') + '</div>' + (room.myVote !== null && room.myVote !== undefined ? '<div class="confirm">✓ ההצבעה נקלטה</div>' : '') + (room.resultsVisible && room.results ? '<div style="margin-top:18px">' + resultBars(room) + '</div>' : '');
    app.innerHTML = '<div class="student">' + hero() + '<div class="card" style="margin-top:14px"><span class="pill neutral">שלב ' + room.activeStage + ' · ' + escapeHtml(stage.title) + '</span>' + body + '</div></div>';
    if (room.status === 'open' && !room.gameRevealed && room.activeStage !== 3) Array.prototype.forEach.call(document.querySelectorAll('.vote[data-answer]'), function (button) { button.addEventListener('click', function () { submitVote(Number(button.getAttribute('data-answer'))); }); });
  }

  function wireMulti(initial) {
    var selected = initial.slice();
    Array.prototype.forEach.call(document.querySelectorAll('.vote[data-answer]'), function (button) { button.addEventListener('click', function () { var n = Number(button.getAttribute('data-answer')); var pos = selected.indexOf(n); if (pos >= 0) selected.splice(pos, 1); else if (selected.length < 3) selected.push(n); else { toast('אפשר לבחור עד שלושה'); return; } button.classList.toggle('sel', selected.indexOf(n) >= 0); }); });
    var send = document.getElementById('sendMulti'); if (send) send.addEventListener('click', function () { submitVote(selected); });
  }

  function submitVote(answer) { apiPost({ action: 'vote', code: student.code, voterId: myVoterId, answer: answer }).then(function () { return apiGet(student.code, ''); }).then(function (room) { student.room = room; renderStudent(); }).catch(function (err) { toast(apiError(err && err.error)); }); }

  function startStudentPolling() { stopPolling(); pollTimer = window.setInterval(function () { if (!student) return; apiGet(student.code, '').then(function (room) { var changed = room.version !== student.room.version || room.status !== student.room.status || room.gameRevealed !== student.room.gameRevealed; student.room = room; if (changed) renderStudent(); }).catch(function () {}); }, 1600); }

  function openProjector() {
    projectorOpen = true;
    var wrap = document.createElement('div'); wrap.className = 'proj'; wrap.id = 'projectorWrap'; wrap.innerHTML = '<button class="btn gh close" id="closeProjector">× יציאה</button><div id="projectorInner"></div>'; document.body.appendChild(wrap);
    document.getElementById('closeProjector').addEventListener('click', function () { projectorOpen = false; var el = document.getElementById('projectorWrap'); if (el) el.parentNode.removeChild(el); });
    updateProjector();
  }

  function updateProjector() {
    if (!projectorOpen || !teacher || !teacher.room) return;
    var room = teacher.room; var inner = document.getElementById('projectorInner'); if (!inner) return;
    if (room.activeStage === 2) { var item = game[room.gameIndex || 0]; inner.innerHTML = '<div style="text-align:center;color:var(--b);font-weight:900">ישראלי – מי יודע? · ' + ((room.gameIndex || 0) + 1) + '/10</div><div class="q">' + escapeHtml(item[0]) + '</div>' + resultBars(room) + (room.gameRevealed ? '<div class="reveal"><b>' + item[2] + '</b><div>' + escapeHtml(item[3]) + '</div></div>' : ''); }
    else { var stage = stages[room.activeStage - 1]; inner.innerHTML = '<div style="text-align:center;color:var(--b);font-weight:900">' + escapeHtml(stage.title) + '</div><div class="q">' + escapeHtml(stage.question) + '</div>' + resultBars(room); }
  }

  function init() {
    if (!app) return;
    var params = new URLSearchParams(location.search); var code = (params.get('code') || '').replace(/\D/g, '').slice(0, 6);
    if (location.pathname === '/teacher' && code) {
      var token = ''; try { token = localStorage.getItem('iwt-' + code) || ''; } catch (e) {}
      if (!token) { renderJoin(code); return; }
      apiGet(code, token).then(function (room) { teacher = { code: code, token: token, room: room }; renderTeacher(); startTeacherPolling(); }).catch(function () { renderCreateClass(); }); return;
    }
    if (location.pathname === '/join' && code) { renderJoin(code); window.setTimeout(joinRoom, 50); return; }
    renderHome();
  }

  window.addEventListener('error', function () { if (!app || app.innerHTML) return; app.innerHTML = '<div class="card form"><h2>תקלה בטעינת הפעילות</h2><p class="muted">רעננו את הדף. אם התקלה נמשכת, נסו לפתוח את הקישור מחדש.</p></div>'; });
  init();
})();
