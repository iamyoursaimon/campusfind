(function(){
  // ================================
  // CAMPUSFIND BACKEND CONFIG
  // ================================
  const API_BASE = 'https://campusfind-backend-e9z6.onrender.com';

  const themeKey='campusFindTheme';
  const body=document.body;
  const profileKey='campusFindProfile';

  if(localStorage.getItem(themeKey)==='dark') body.classList.add('dark');

  function initials(name){
    return (name||'Student').trim().split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase()||'S';
  }

  function currentProfile(){
    try{
      return JSON.parse(localStorage.getItem(profileKey)||'{}');
    }catch{
      return {};
    }
  }

  function isSignedIn(){
    return !!localStorage.getItem('firebaseUID') || !!localStorage.getItem(profileKey);
  }

  function saveProfile(p){
    localStorage.setItem(profileKey,JSON.stringify(p));
  }

  async function readJson(response){
    const raw=await response.text();
    if(!raw.trim()) return null;

    try{
      return JSON.parse(raw);
    }catch{
      return null;
    }
  }

  function toggleTheme(){
    body.classList.toggle('dark');

    localStorage.setItem(
      themeKey,
      body.classList.contains('dark') ? 'dark' : 'light'
    );

    document.querySelectorAll('.theme').forEach(btn=>{
      btn.innerHTML='<i data-lucide="'+
        (body.classList.contains('dark')?'sun-medium':'moon')+
        '"></i>';
    });

    if(window.lucide) lucide.createIcons();
  }

  document.querySelectorAll('.theme').forEach(btn=>{
    btn.addEventListener('click',toggleTheme);
  });

  function decorateNav(){
    const nav=document.querySelector('.nav-actions, .actions, .nav nav');

    if(!nav)return;

    const signedIn=isSignedIn();
    const profile=currentProfile();
    const mobileMenu=document.querySelector('.mobile-menu');

    // Remove old generated controls
    nav.querySelectorAll('.cf-generated').forEach(el=>el.remove());

    if(signedIn){

      [nav,mobileMenu]
        .filter(Boolean)
        .forEach(container=>
          container
            .querySelectorAll(
              'a[href="login.html"], a[href="signup.html"]'
            )
            .forEach(link=>link.remove())
        );

      if(!nav.querySelector('a[href="recent.html"]')){
        const recent=document.createElement('a');

        recent.href='recent.html';
        recent.className='cf-generated cf-recent-link';

        recent.innerHTML=
          '<span>Recent</span><i class="cf-recent-dot"></i>';

        nav.appendChild(recent);
      }

      const profileLink=document.createElement('a');

      profileLink.href='profile.html';
      profileLink.className='cf-generated cf-profile-chip';

      const avatar = profile.profileImage
        ? `<img src="${profile.profileImage}" alt="" class="cf-profile-avatar cf-profile-avatar-img">`
        : `<span class="cf-profile-avatar">${initials(profile.fullName)}</span>`;

      profileLink.innerHTML=
        avatar+
        '<span>'+
        ((profile.fullName||'Profile').split(' ')[0])+
        '</span>';

      nav.appendChild(profileLink);

      const logout=document.createElement('button');

      logout.type='button';
      logout.className='cf-generated cf-logout-btn';

      logout.innerHTML=
        '<i data-lucide="log-out"></i><span>Logout</span>';

      logout.addEventListener('click', async ()=>{
        logout.disabled=true;

        try{
          const mod=await import('./auth.js');
          await mod.logoutUser();
        }catch(e){
          console.warn('Firebase logout fallback:',e);
        }

        localStorage.removeItem('firebaseUID');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('selectedCampus');
        localStorage.removeItem(profileKey);

        window.location.href='index.html';
      });

      nav.appendChild(logout);

    }else{

      if(!nav.querySelector('a[href="login.html"]')){
        const login=document.createElement('a');

        login.className='cf-generated';
        login.href='login.html';
        login.textContent='Sign In';

        nav.appendChild(login);
      }

      if(!nav.querySelector('a[href="signup.html"]')){
        const signup=document.createElement('a');

        signup.className='cf-generated cf-signup-nav';
        signup.href='signup.html';
        signup.textContent='Sign Up';

        nav.appendChild(signup);
      }
    }

    if(window.lucide)lucide.createIcons();

    body.classList.add('cf-ready');
  }


  // ================================
  // LIVE NOTIFICATION
  // ================================

  let notificationIndex=0;

  async function showLiveNotification(){

    if(!document.body.classList.contains('home-page')) return;

    document.querySelector('.cf-live-notification')?.remove();

    const fallback=[
      {
        title:'Black Wallet',
        campus:'GEC',
        location:'Main Gate Security Desk',
        status:'found'
      },
      {
        title:'Student ID Card',
        campus:'Hazari Line',
        location:'Central Library',
        status:'lost'
      },
      {
        title:'Blue Notebook',
        campus:'WASA',
        location:'Student Lounge',
        status:'found'
      },
      {
        title:'Room Keys',
        campus:'GEC',
        location:'Academic Building',
        status:'lost'
      }
    ];

    let live=fallback[
      notificationIndex++%fallback.length
    ];

    try{

      // IMPORTANT:
      // Render frontend must use the separate backend URL.
      const [rr,cr]=await Promise.all([
        fetch(`${API_BASE}/api/reports`),
        fetch(`${API_BASE}/api/community`)
      ]);

      if(rr.ok){

        const d=await readJson(rr);

        if(d?.reports?.length){

          const r=d.reports[0];

          live={
            ...live,
            ...r,
            campus:r.campus||r.campusName,
            location:r.location,
            _fromReport:true
          };
        }
      }

      if(cr.ok && !live._fromReport){

        const d=await readJson(cr);

        if(d?.posts?.length){

          const p=d.posts[0];

          live={
            title:`${p.name||'A student'} shared a campus update`,
            campus:p.role||'Campus community',
            location:'Just now',
            status:'community',
            text:p.text
          };
        }
      }

    }catch(error){

      // Backend temporarily unavailable.
      // Keep the website working with the fallback notification.
      console.warn(
        'CampusFind backend notification request failed:',
        error
      );
    }

    const note=document.createElement('div');

    note.className='cf-live-notification';

    const heading=
      live.status==='community'
        ? 'COMMUNITY UPDATE'
        : (
            live.status==='lost'
              ? 'NEW LOST ITEM'
              : 'NEW FOUND ITEM'
          );

    const title=live.title||'Campus activity';

    note.innerHTML=`
      <button class="cf-live-close" aria-label="Close">×</button>

      <div class="cf-live-icon">
        <i data-lucide="${
          live.status==='community'
            ? 'message-circle'
            : 'bell-ring'
        }"></i>
      </div>

      <div class="cf-live-copy">
        <span>${heading}</span>

        <strong>${title}</strong>

        <p>
          ${live.campus||'CampusFind'}
          ·
          ${live.location||'Recently reported'}
        </p>

        <a href="${
          live.status==='community'
            ? 'index.html#community'
            : 'recent.html'
        }">
          View update →
        </a>
      </div>
    `;

    document.body.appendChild(note);

    requestAnimationFrame(()=>{
      note.classList.add('show');
    });

    const close=()=>{
      note.classList.remove('show');

      setTimeout(()=>{
        note.remove();
      },300);
    };

    note.querySelector('.cf-live-close').onclick=close;

    setTimeout(close,3600);

    if(window.lucide)lucide.createIcons();
  }


  function startup(){

    if(!document.body.classList.contains('home-page')) return;

    showLiveNotification();

    setInterval(showLiveNotification,6000);
  }


  // ================================
  // START CAMPUSFIND
  // ================================

  decorateNav();
  startup();

  // Make backend URL available to other scripts if needed
  window.CampusFindAPI = API_BASE;

  window.CampusFind={
    initials,
    currentProfile,
    decorateNav,
    saveProfile,
    toggleTheme
  };

})();