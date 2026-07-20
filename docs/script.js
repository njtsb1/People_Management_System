const LANGS = {
  "en": {
    title: "Registration",
    subtitle: "Connect with former classmates, coworkers, and colleagues.",
    profile: "Profile",
    register: "Register a person",
    name: "Name",
    email: "Email",
    organization: "Organization",
    year: "Year",
    add: "Add",
    reset: "Reset",
    participants: "Participants",
    myFriends: "My Friends",
    communities: "Communities",
    noFriends: "No friends yet",
    searchPlaceholder: "Search by name, year or organization",
    editProfile: "Edit profile",
    inviteFriends: "Invite friends",
    deleteConfirm: "Delete this person?",
    saved: "Saved",
    deleted: "Deleted",
    updated: "Updated",
    addFriend: "+ friend"
  },
  "pt-BR": {
    title: "Cadastro",
    subtitle: "Conecte-se com ex-colegas de classe, colegas de trabalho e contatos.",
    profile: "Perfil",
    register: "Cadastrar pessoa",
    name: "Nome",
    email: "Email",
    organization: "Organização",
    year: "Ano",
    add: "Adicionar",
    reset: "Limpar",
    participants: "Participantes",
    myFriends: "Meus Amigos",
    communities: "Comunidades",
    noFriends: "Ainda sem amigos",
    searchPlaceholder: "Pesquisar por nome, ano ou organização",
    editProfile: "Editar perfil",
    inviteFriends: "Convidar amigos",
    deleteConfirm: "Excluir esta pessoa?",
    saved: "Salvo",
    deleted: "Excluído",
    updated: "Atualizado",
    addFriend: "+ amigo"
  },
  "es": {
    title: "Registro",
    subtitle: "Conéctate con excompañeros, colegas y contactos.",
    profile: "Perfil",
    register: "Registrar persona",
    name: "Nombre",
    email: "Correo",
    organization: "Organización",
    year: "Año",
    add: "Agregar",
    reset: "Limpiar",
    participants: "Participantes",
    myFriends: "Mis Amigos",
    communities: "Comunidades",
    noFriends: "Sin amigos aún",
    searchPlaceholder: "Buscar por nombre, año u organización",
    editProfile: "Editar perfil",
    inviteFriends: "Invitar amigos",
    deleteConfirm: "¿Eliminar esta persona?",
    saved: "Guardado",
    deleted: "Eliminado",
    updated: "Actualizado",
    addFriend: "+ amigo"
  }
};

const SELECTORS = {
  form: '#person-form',
  name: '#name',
  email: '#email',
  org: '#organization',
  year: '#year',
  peopleList: '#people-list',
  template: '#person-item-template',
  saveBtn: '#save-btn',
  resetBtn: '#reset-btn',
  search: '#search',
  sort: '#sort',
  toast: '#toast',
  langSelect: '#lang-select',
  appTitle: '#app-title',
  appSubtitle: '#app-subtitle',
  profileName: '#profile-name',
  profileOrg: '#profile-org',
  themeToggle: '#theme-toggle',
  themeIcon: '#theme-icon',
  yearText: '#year'
};

let state = {
  people: [],
  editingId: null,
  lang: 'en',
  theme: 'dark'
};

function $(sel){return document.querySelector(sel)}
function $all(sel){return Array.from(document.querySelectorAll(sel))}

function loadState(){
  try{
    const raw = localStorage.getItem('people_manager_v1');
    if(raw) state = {...state, ...JSON.parse(raw)};
  }catch(e){console.warn('load error', e)}
}
function saveState(){
  localStorage.setItem('people_manager_v1', JSON.stringify(state));
}

function i18(key){
  const dict = LANGS[state.lang] || LANGS.en;
  return dict[key] || key;
}

function showToast(msg, timeout=2000){
  const t = $(SELECTORS.toast);
  t.textContent = msg;
  t.style.display = 'block';
  setTimeout(()=> t.style.display='none', timeout);
}

function renderTexts(){
  $(SELECTORS.appTitle).textContent = i18('title');
  $(SELECTORS.appSubtitle).textContent = i18('subtitle');
  $(SELECTORS.profileName).textContent = i18('profile');
  $(SELECTORS.profileOrg).textContent = '';
  $('#form-heading').textContent = i18('register');
  $('label[for="name"]').textContent = i18('name');
  $('label[for="email"]').textContent = i18('email');
  $('label[for="organization"]').textContent = i18('organization');
  $('#label-year').textContent = i18('year');
  $(SELECTORS.saveBtn).textContent = i18('add');
  $(SELECTORS.resetBtn).textContent = i18('reset');
  $('#list-heading').textContent = i18('participants');
  $('#sidebar-heading').textContent = i18('myFriends');
  $(SELECTORS.yearText).textContent = new Date().getFullYear();
  $('#search').placeholder = i18('searchPlaceholder');
}

function applyTheme(){
  const body = document.body;
  if(state.theme === 'light'){
    body.classList.remove('theme-dark');
    body.classList.add('theme-light');
    document.documentElement.classList.add('light');
    $(SELECTORS.themeToggle).setAttribute('aria-pressed','false');
    $(SELECTORS.themeIcon).innerHTML = sunSVG();
  } else {
    body.classList.remove('theme-light');
    body.classList.add('theme-dark');
    document.documentElement.classList.remove('light');
    $(SELECTORS.themeToggle).setAttribute('aria-pressed','true');
    $(SELECTORS.themeIcon).innerHTML = moonSVG();
  }
}

function moonSVG(){
  return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="currentColor"/>
  </svg>`;
}
function sunSVG(){
  return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true">
    <path d="M6.76 4.84l-1.8-1.79L3.17 4.84l1.79 1.8 1.8-1.8zM1 13h3v-2H1v2zm10 9h2v-3h-2v3zm7.03-2.03l1.79 1.79 1.79-1.79-1.79-1.79-1.79 1.79zM20 11v2h3v-2h-3zM4.22 19.78l1.79-1.79-1.79-1.79-1.79 1.79 1.79 1.79zM12 6a6 6 0 100 12 6 6 0 000-12z" fill="currentColor"/>
  </svg>`;
}

function uid(){ return 'p_' + Math.random().toString(36).slice(2,9) }

function addPerson(person){
  state.people.push(person);
  saveState();
  renderList();
  showToast(i18('saved'));
}

function updatePerson(id, data){
  const idx = state.people.findIndex(p=>p.id===id);
  if(idx>-1){
    state.people[idx] = {...state.people[idx], ...data};
    saveState();
    renderList();
    showToast(i18('updated'));
  }
}

function deletePerson(id){
  if(!confirm(i18('deleteConfirm'))) return;
  state.people = state.people.filter(p=>p.id!==id);
  saveState();
  renderList();
  showToast(i18('deleted'));
}

function renderList(){
  const list = $(SELECTORS.peopleList);
  list.innerHTML = '';
  const template = document.getElementById('person-item-template');
  const search = $(SELECTORS.search).value.trim().toLowerCase();
  const sortBy = $(SELECTORS.sort).value;

  let items = state.people.slice();
  if(search){
    items = items.filter(p => {
      const yearStr = p.year ? String(p.year) : '';
      return (p.name + ' ' + yearStr + ' ' + (p.organization||''))
        .toLowerCase()
        .includes(search);
    });
  }

  items.sort((a,b)=>{
    if(sortBy==='year'){
      const ay = a.year || 0;
      const by = b.year || 0;
      return ay - by;
    }
    if(sortBy==='organization'){
      return (a.organization||'').localeCompare(b.organization||'');
    }
    return a.name.localeCompare(b.name);
  });

  if(items.length===0){
    const li = document.createElement('li');
    li.className = 'muted';
    li.textContent = i18('participants') + ' — 0';
    list.appendChild(li);
    return;
  }

  items.forEach(p=>{
    const node = template.content.cloneNode(true);
    const li = node.querySelector('li');
    li.dataset.id = p.id;
    node.querySelector('.pname').textContent = p.name;
    node.querySelector('.pemail').textContent = p.email;
    node.querySelector('.porg').textContent = p.organization || '';
    node.querySelector('.pyear').textContent = p.year ? `${i18('year')}: ${p.year}` : '';
    const addBtn = node.querySelector('.add-friend');
    addBtn.textContent = i18('addFriend');
    addBtn.addEventListener('click', ()=> {
      addToFriends(p);
    });

    node.querySelector('.edit').addEventListener('click', ()=> {
      startEdit(p.id);
    });
    node.querySelector('.delete').addEventListener('click', ()=> {
      deletePerson(p.id);
    });

    list.appendChild(node);
  });
}

function addToFriends(person){
  const box = $('#friends');
  const el = document.createElement('div');
  el.className = 'friend';
  el.textContent = person.name;
  box.appendChild(el);
  showToast(`${person.name} — ${i18('saved')}`);
}

function startEdit(id){
  const p = state.people.find(x=>x.id===id);
  if(!p) return;
  state.editingId = id;
  $(SELECTORS.name).value = p.name;
  $(SELECTORS.email).value = p.email;
  $(SELECTORS.org).value = p.organization || '';
  $(SELECTORS.year).value = p.year || '';
  $(SELECTORS.saveBtn).textContent = i18('updated');
  $(SELECTORS.name).focus();
}

function resetForm(){
  state.editingId = null;
  $(SELECTORS.form).reset();
  $(SELECTORS.saveBtn).textContent = i18('add');
}

function bindEvents(){
  // form submit
  $(SELECTORS.form).addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = $(SELECTORS.name).value.trim();
    const email = $(SELECTORS.email).value.trim();
    const org = $(SELECTORS.org).value.trim();
    const yearVal = $(SELECTORS.year).value.trim();
    const year = yearVal ? parseInt(yearVal, 10) : null;
    if(!name || !email) return;

    if(state.editingId){
      updatePerson(state.editingId, {name, email, organization:org, year});
    } else {
      addPerson({id: uid(), name, email, organization:org, year});
    }
    resetForm();
  });

  $(SELECTORS.resetBtn).addEventListener('click', resetForm);

  $(SELECTORS.search).addEventListener('input', renderList);
  $(SELECTORS.sort).addEventListener('change', renderList);

  $(SELECTORS.langSelect).addEventListener('change', (e)=>{
    state.lang = e.target.value;
    renderTexts();
    renderList();
    saveState();
  });

  $(SELECTORS.themeToggle).addEventListener('click', ()=>{
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme();
    saveState();
  });

  // keyboard accessibility: Enter on list items to edit
  $(SELECTORS.peopleList).addEventListener('keydown', (e)=>{
    if(e.key === 'Enter'){
      const li = e.target.closest('li');
      if(li) startEdit(li.dataset.id);
    }
  });
}

function initDefaults(){
  // default sample data if none
  if(!state.people || state.people.length === 0){
    state.people = [
      {id: uid(), name: "Marlene", email: "marlene@example.com", organization: "Kamaity School Teacher", year: 1998},
      {id: uid(), name: "Cida Costa", email: "cidacosta@example.com", organization: "Kamaity School Teacher", year: 1999},
      {id: uid(), name: "Marilda Ferreira", email: "marildaferreira@example.com", organization: "Kamaity School Teacher", year: 2000},
      {id: uid(), name: "Adélia (in memoriam)", email: "adelia@example.com", organization: "Kamaity School Teacher", year: 2001},
      {id: uid(), name: "Adosinda C. Mendes", email: "adosindamendes@example.com", organization: "Poet School Teacher", year: 2003},
      {id: uid(), name: "César A. M. Santos", email: "cesaramssantos@example.com", organization: "Poet School Teacher", year: 2004},
      {id: uid(), name: "Cláudia R. Gonçalves", email: "claudiargoncalves@example.com", organization: "Poet School Teacher", year: 2002},
      {id: uid(), name: "Dani F. de Carvalho", email: "danifdecarvalho@example.com", organization: "Poet School Teacher", year: 2006},
      {id: uid(), name: "Edi Isabel C. Leite", email: "ediisabelcleite@example.com", organization: "Poet School Teacher", year: 2002},
      {id: uid(), name: "Izabel Bezerra S. Mota", email: "izabelbezerrasmota@example.com", organization: "Poet School Teacher", year: 2002},
      {id: uid(), name: "José Milton D. Souza (in memoriam)", email: "josemiltondsouza@example.com", organization: "Poet School Teacher", year: 2006},
      {id: uid(), name: "Leila Maria G. Ferreira", email: "leilamariagferreira@example.com", organization: "Poet School Teacher", year: 2002},
      {id: uid(), name: "Lucia Maria G. Lorena", email: "luciamariaglorena@example.com", organization: "Poet School Teacher", year: 2007},
      {id: uid(), name: "Luciana Ap. L. P. Barduco", email: "lucianaaplpbarduco@example.com", organization: "Poet School Teacher", year: 2005},
      {id: uid(), name: "Manoel V. S. Neto", email: "manoelvsneto@example.com", organization: "Poet School Teacher", year: 2006},
      {id: uid(), name: "Márcia Ap. de Oliveira", email: "marciaapdeoliveira@example.com", organization: "Poet School Teacher", year: 2003},
      {id: uid(), name: "Maria Ap. C. Gonçalves", email: "mariaapcgoncalves@example.com", organization: "Poet School Teacher", year: 2002},
      {id: uid(), name: "Maria Ap. L. Solsonaro", email: "mariaaplsolsonaro@example.com", organization: "Poet School Teacher", year: 2002},
      {id: uid(), name: "Maria de Fátima R. Guimarães", email: "mariadefatimarguimaraes@example.com", organization: "Poet School Teacher", year: 2004},
      {id: uid(), name: "Maria Paula de Moraes", email: "mariapaulademoraes@example.com", organization: "Poet School Teacher", year: 2002},
      {id: uid(), name: "Noé Hidehiro Nagata", email: "noehidehironagata@example.com", organization: "Poet School Teacher", year: 2002},
      {id: uid(), name: "Paulo Eduardo L. Lopes", email: "pauloeduardollopes@example.com", organization: "Poet School Teacher", year: 2005},
      {id: uid(), name: "Reginaldo G. Becherer", email: "reginaldogbecherer@example.com", organization: "Poet School Teacher", year: 2005},
      {id: uid(), name: "Tereza Tieko Nagata", email: "terezatiekonagata@example.com", organization: "Poet School Teacher", year: 2005},
      {id: uid(), name: "Wanderlúcia Elizabeth dos Santos", email: "wanderluciaelizabethdossantos@example.com", organization: "Poet School Teacher", year: 2002},
      {id: uid(), name: "Néia", email: "neia@example.com", organization: "Poet School Teacher", year: 2002},
      {id: uid(), name: "Paulinho", email: "paulinho@example.com", organization: "Poet School Teacher", year: 2008},
      {id: uid(), name: "Gilmara", email: "gilmara@example.com", organization: "Poet School Teacher", year: 2004},
      {id: uid(), name: "Rogéria Valkiria", email: "rogeriavalkiria@example.com", organization: "Poet School Teacher", year: 2002},
      {id: uid(), name: "Marcelino", email: "marcelino@example.com", organization: "Poet School Teacher", year: 2004},
      {id: uid(), name: "Leonel", email: "leonel@example.com", organization: "Poet School Teacher", year: 2005},
      {id: uid(), name: "Mira Maria de Lira", email: "miramarialira@example.com", organization: "Poet School Teacher", year: 2004},
      {id: uid(), name: "Silvio", email: "silvio@example.com", organization: "Poet School Teacher", year: 2002},
      {id: uid(), name: "Francisca", email: "francisca@example.com", organization: "Poet School Teacher", year: 2005},
      {id: uid(), name: "Suzy", email: "suzy@example.com", organization: "Poet School Teacher", year: 2004},
      {id: uid(), name: "Glayson", email: "glayson@example.com", organization: "Poet School Teacher", year: 2006},
      {id: uid(), name: "Rafael", email: "rafael@example.com", organization: "Poet School Teacher", year: 2007},
      {id: uid(), name: "Aurea", email: "aurea@example.com", organization: "Kamaity School Employee", year: 1998},
      {id: uid(), name: "Maria Nelson", email: "marianelson@example.com", organization: "Kamaity School Employee", year: 1998},
      {id: uid(), name: "João R. Fortes", email: "joaorfortes@example.com", organization: "Poet School Employee", year: 2002},
      {id: uid(), name: "Juliana B. Carvalho", email: "julianabcarvalho@example.com", organization: "Poet School Employee", year: 2002},
      {id: uid(), name: "Marlene G. Lopes", email: "marleneglopes@example.com", organization: "Poet School Employee", year: 2002},
      {id: uid(), name: "Marta C. G. Silva", email: "martacgsilva@example.com", organization: "Poet School Employee", year: 2002},
      {id: uid(), name: "Marta R. Raquel", email: "martarraquel@example.com", organization: "Poet School Employee", year: 2002},
      {id: uid(), name: "Milton Capizani", email: "miltoncapizani@example.com", organization: "Poet School Employee", year: 2002},
      {id: uid(), name: "Neusa Ap. de Jesus", email: "neusaapdejesus@example.com", organization: "Poet School Employee", year: 2002},
      {id: uid(), name: "Neusa C. D. Cardoso", email: "neusacdcardsoso@example.com", organization: "Poet School Employee", year: 2002},
      {id: uid(), name: "Norma R. G. Porfírio", email: "normargporfírio@example.com", organization: "Poet School Employee", year: 2002},
      {id: uid(), name: "Olga M. Tanaka", email: "olgamtanaka@example.com", organization: "Poet School Employee", year: 2002},
      {id: uid(), name: "Silene G. C. Leal", email: "silenegcleal@example.com", organization: "Poet School Employee", year: 2002},
      {id: uid(), name: "Tânia Mª R. Almeida", email: "taniamralmeida@example.com", organization: "Poet School Employee", year: 2002},
      {id: uid(), name: "Jorge B. Benedito", email: "jorgebbenedito@example.com", organization: "Poet School Master", year: 2002},
      {id: uid(), name: "Iolanda B. V. Bugança", email: "iolandabvbugança@example.com", organization: "Poet School Master", year: 2002},
      {id: uid(), name: "Antonio Cunha", email: "antoniocunha@example.com", organization: "Poet School Master", year: 2002},
      {id: uid(), name: "Alan Bruno Gonzaga Costa", email: "alanbrunogonzagacosta@example.com", organization: "Schoolmate Poet", year: 2004},
      {id: uid(), name: "Alex Reis", email: "alexreis@example.com", organization: "Schoolmate Poet", year: 2004},
      {id: uid(), name: "Andressa Oliveira de Santana", email: "andressaoliveiradesantana@example.com", organization: "Schoolmate Poet", year: 2004},
      {id: uid(), name: "Bruna Batistela de França", email: "brunabatisteladefrança@example.com", organization: "Schoolmate Poet", year: 2005},
      {id: uid(), name: "Bruno Ferreira França", email: "brunoferreirafança@example.com", organization: "Schoolmate Poet", year: 2004},
      {id: uid(), name: "Durvalino Floriano", email: "durvalinofloriano@example.com", organization: "Schoolmate Poet", year: 2004},
      {id: uid(), name: "Fabiano Oliveira dos Passos", email: "fabianooliveiradospassos@example.com", organization: "Schoolmate Poet", year: 2004},
      {id: uid(), name: "Felipe Gomes Ferreira", email: "felipegomesferreira@example.com", organization: "Schoolmate Poet", year: 2004},
      {id: uid(), name: "Juliana Maria Ramos", email: "julianamariaramos@example.com", organization: "Schoolmate Poet", year: 2004},
      {id: uid(), name: "Leandro Oliveira Fontes Silva", email: "leandrooliveirafontessilva@example.com", organization: "Schoolmate Poet", year: 2004},
      {id: uid(), name: "Mariane Ferraz M. Almeida", email: "marianeferrazmalmeida@example.com", organization: "Schoolmate Poet", year: 2004},
      {id: uid(), name: "Neto", email: "neto@example.com", organization: "Schoolmate Poet", year: 2004},
      {id: uid(), name: "Newton Franco M. Junior", email: "newtonfrancomjunior@example.com", organization: "Schoolmate Poet", year: 2004},
      {id: uid(), name: "Nubia Daiane da Silva", email: "nubiadaienedasilva@example.com", organization: "Schoolmate Poet", year: 2004},
      {id: uid(), name: "Tais Fernandes de Souza", email: "taisfernandesdesouza@example.com", organization: "Schoolmate Poet", year: 2004},
      {id: uid(), name: "William", email: "william@example.com", organization: "Schoolmate Poet", year: 2004},
      {id: uid(), name: "Alcides José Valentim de Deus, aka 'Formigão'", email: "alcidesformigao@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Alex Floriano Pinto, aka 'Cavalo'", email: "alexfpinto@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Bruna Silva", email: "brunasilva@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Daniel", email: "daniel@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Edilson de Souza Bonruk, aka 'Bauduco'", email: "edilsondesouzabonruk@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Emerson R. F. Pereira, aka 'Minho' (in memoriam)", email: "emersonrfpereira@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Gilda, Telo's sister", email: "gilda@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Gilmar", email: "gilmar@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Janaina Neves Bento", email: "janainanbento@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Jeferson Severiano S. Carvalho, aka 'Neno'", email: "jefersonneno@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Jéssica Teixeira", email: "jessicateixeira@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Julianne dos Santos Silva", email: "juliannessilva@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Kelly da Cruz", email: "kellycruz@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Leonardo Bispo Ribeiro, aka 'Léo'", email: "leonardobisporibeiro@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Marcelo L. Borba", email: "marcelolborba@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Maria Aparecida dos Santos", email: "mariaassantos@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Rita de Cassia Paula da Silva", email: "ritacpsilva@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Rodrigo Pires dos Santos, aka 'Mané'", email: "rodrigopsantos@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Simone da Cunha Domingues", email: "simonecdomingues@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Suelen", email: "suelen@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Tatiana Nunes", email: "tatiananunes@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Tiago Fernandes", email: "tiagofernandes@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Veronica Gonçalves da Silva", email: "veronicagsilva@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Welligton Rodrigues", email: "welligtonrodrigues@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Welligton Tobias", email: "welligtontobias@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Alan Willian F. Silva", email: "alanwfsilva@example.com", organization: "Schoolmate Poet", year: 2006},
      {id: uid(), name: "Alexandre Silva Lima, aka 'Gordão'", email: "alexandreslima@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Arivil", email: "arivil@example.com", organization: "Schoolmate Poet", year: 2007},
      {id: uid(), name: "Bruno Vieira de Santana, aka 'Repolho'", email: "brunovsantana@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Fernando", email: "fernando@example.com", organization: "Schoolmate Poet", year: 2007},
      {id: uid(), name: "José Augusto", email: "joseaugusto@example.com", organization: "Schoolmate Poet", year: 2007},
      {id: uid(), name: "Luan Bernardo, aka 'Bilu'", email: "luanbernardo@example.com", organization: "Schoolmate Poet", year: 2007},
      {id: uid(), name: "Luiz Guilherme Bernardo, aka 'Lugui'", email: "luizgbernardo@example.com", organization: "Schoolmate Poet", year: 2006},
      {id: uid(), name: "Robson Fernandes", email: "robsonfernandes@example.com", organization: "Schoolmate Poet", year: 2006},
      {id: uid(), name: "Robson Florindo", email: "robsonflorindo@example.com", organization: "Schoolmate Poet", year: 2006},
      {id: uid(), name: "Adriana", email: "adriana@example.com", organization: "Schoolmate Poet", year: 2007},
      {id: uid(), name: "Amanda Gabriela Queiroz Ribeiro", email: "amandagqribeiro@example.com", organization: "Schoolmate Poet", year: 2007},
      {id: uid(), name: "Ariane Rodrigues Batistela", email: "arianerbatistela@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Carol Lara", email: "carollara@example.com", organization: "Schoolmate Poet", year: 2007},
      {id: uid(), name: "Daniele Silva dos Santos", email: "danielessantos@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Dayane Almeida", email: "dayanealmeida@example.com", organization: "Schoolmate Poet", year: 2006},
      {id: uid(), name: "Denifer Canuto de Oliveira", email: "denifercoliveira@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Edlaine da Silva Nobrega", email: "edlainesnobrega@example.com", organization: "Schoolmate Poet", year: 2007},
      {id: uid(), name: "Edna da Silva Nobrega", email: "ednadsnobrega@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Erika Bianchi", email: "erikabianchi@example.com", organization: "Schoolmate Poet", year: 2007},
      {id: uid(), name: "Fernanda Santos", email: "fernandasantos@example.com", organization: "Schoolmate Poet", year: 2007},
      {id: uid(), name: "Jessica do Prado Raimundo", email: "jessicapraimundo@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Jessica Lara", email: "jessicalara@example.com", organization: "Schoolmate Poet", year: 2007},
      {id: uid(), name: "Juliana Tavares da Silva", email: "julianatavares@example.com", organization: "Schoolmate Poet", year: 2007},
      {id: uid(), name: "Julie Moraes Silva", email: "juliemoraes@example.com", organization: "Schoolmate Poet", year: 2007},
      {id: uid(), name: "Márcia", email: "marcia@example.com", organization: "Schoolmate Poet", year: 2007},
      {id: uid(), name: "Milena Cassiano", email: "milenacassiano@example.com", organization: "Schoolmate Poet", year: 2007},
      {id: uid(), name: "Priscila Martins", email: "priscilamartins@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Rosa Macedo", email: "rosamacedo@example.com", organization: "Schoolmate Poet", year: 2007},
      {id: uid(), name: "Rosemary", email: "rosemary@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Talita Pupo Pupo", email: "talitapupo@example.com", organization: "Schoolmate Poet", year: 2007},
      {id: uid(), name: "Thais de Oliveira Antunes", email: "thaisoliveira@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Thayná", email: "thayna@example.com", organization: "Schoolmate Poet", year: 2007},
      {id: uid(), name: "Thuany", email: "thuany@example.com", organization: "Schoolmate Poet", year: 2007},
      {id: uid(), name: "Aline, Veronica's sister", email: "aline@example.com", organization: "Schoolmate Kamaity", year: 1998},
      {id: uid(), name: "Aline Pinto Carvalho, Mané's cousin", email: "alinepcarvalho@example.com", organization: "Schoolmate Kamaity", year: 1998},
      {id: uid(), name: "Angélica, Guilherme's cousin", email: "angelica@example.com", organization: "Schoolmate Kamaity", year: 1998},
      {id: uid(), name: "Anselmo, Onadir and Lourdes's brother", email: "anselmo@example.com", organization: "Schoolmate Kamaity", year: 1998},
      {id: uid(), name: "Beto, Robert and Cézar's brother", email: "beto@example.com", organization: "Schoolmate Kamaity", year: 1999},
      {id: uid(), name: "Bruna", email: "bruna@example.com", organization: "Schoolmate Kamaity", year: 1999},
      {id: uid(), name: "Camila", email: "camila@example.com", organization: "Schoolmate Kamaity", year: 2001},
      {id: uid(), name: "Cézar Henrique da Cruz", email: "cezarhcruz@example.com", organization: "Schoolmate Kamaity", year: 1998},
      {id: uid(), name: "Claudinei, Angélica cousin", email: "claudinei@example.com", organization: "Schoolmate Kamaity", year: 1998},
      {id: uid(), name: "Clayton, aka 'X da Vaca'", email: "clayton@example.com", organization: "Schoolmate Kamaity", year: 1998},
      {id: uid(), name: "Cristina, Daniela's sister", email: "cristina@example.com", organization: "Schoolmate Kamaity", year: 1998},
      {id: uid(), name: "Daniela, Cristina's sister", email: "daniela@example.com", organization: "Schoolmate Kamaity", year: 1998},
      {id: uid(), name: "Denner, Vanda's nephew", email: "denner@example.com", organization: "Schoolmate Kamaity", year: 1999},
      {id: uid(), name: "Fernanda Brunette", email: "fernadabrunette@example.com", organization: "Schoolmate Kamaity", year: 2001},
      {id: uid(), name: "Fernanda Galdino, Flávia's sister", email: "fernandagaldino@example.com", organization: "Schoolmate Kamaity", year: 1999},
      {id: uid(), name: "Flávia Galdino, Fernanda's sister", email: "flaviagaldino@example.com", organization: "Schoolmate Kamaity", year: 1999},
      {id: uid(), name: "Guilherme Henrique, Ricardo's brother", email: "guilhermehenrique@example.com", organization: "Schoolmate Kamaity", year: 1999},
      {id: uid(), name: "Ivan, Luis Fernando's brother", email: "ivan@example.com", organization: "Schoolmate Kamaity", year: 2001},
      {id: uid(), name: "Jéssica Custódio Mendonça", email: "jessicacmendonca@example.com", organization: "Schoolmate Kamaity", year: 1998},
      {id: uid(), name: "Roberto Jr, Vinicius's brother, aka 'Juninho Nuno", email: "juninho@example.com", organization: "Schoolmate Kamaity", year: 1999},
      {id: uid(), name: "Juvenil", email: "juvenil@example.com", organization: "Schoolmate Kamaity", year: 1999},
      {id: uid(), name: "Lidiane", email: "lidiane@example.com", organization: "Schoolmate Kamaity", year: 1998},
      {id: uid(), name: "Lourdes, Anselmo and Onadir's brother", email: "lourdes@example.com", organization: "Schoolmate Kamaity", year: 1998},
      {id: uid(), name: "Luis Fernando, Ivan's brother", email: "luisfernando@example.com", organization: "Schoolmate Kamaity", year: 2001},
      {id: uid(), name: "Márcia Duarte, Miriam's sister", email: "marciaduarte@example.com", organization: "Schoolmate Kamaity", year: 1998},
      {id: uid(), name: "Marco Antônio, Ivan e Luis Fernando brother", email: "marcoantonio@example.com", organization: "Schoolmate Kamaity", year: 1999},
      {id: uid(), name: "Marco Antônio Farias, cousin", email: "marcoafarias@example.com", organization: "Schoolmate Kamaity", year: 1999},
      {id: uid(), name: "Miriam Duarte, Márcia's sister", email: "miriamduarte@example.com", organization: "Schoolmate Kamaity", year: 1998},
      {id: uid(), name: "Onadir, Lourdes and Anselmo's brother", email: "onadir@example.com", organization: "Schoolmate Kamaity", year: 1998},
      {id: uid(), name: "Rafael Bibiano da Silva", email: "rafaelbsilva@example.com", organization: "Schoolmate Kamaity", year: 1998},
      {id: uid(), name: "Reginaldo, Reinaldo's brother", email: "reginaldo@example.com", organization: "Schoolmate Kamaity", year: 2001},
      {id: uid(), name: "Reinaldo, Reginaldo's brother", email: "reinaldo@example.com", organization: "Schoolmate Kamaity", year: 2001},
      {id: uid(), name: "Ricardinho, Guilherme's brother", email: "ricardinho@example.com", organization: "Schoolmate Kamaity", year: 2001},
      {id: uid(), name: "Rita de Cássia dos Santos Souza, cousin", email: "ritacssouza@example.com", organization: "Schoolmate Kamaity", year: 2001},
      {id: uid(), name: "Robert, Beto and Cézar's brother", email: "robert@example.com", organization: "Schoolmate Kamaity", year: 2001},
      {id: uid(), name: "Rodrigo (in memoriam)", email: "rodrigo@example.com", organization: "Schoolmate Kamaity", year: 1998},
      {id: uid(), name: "Rodrigo José", email: "rodrigojose@example.com", organization: "Schoolmate Kamaity", year: 1998},
      {id: uid(), name: "Rosana, Cristina and Daniela 's sister", email: "rosana@example.com", organization: "Schoolmate Kamaity", year: 2001},
      {id: uid(), name: "Sebastião, Simone's brother", email: "sebastiao@example.com", organization: "Schoolmate Kamaity", year: 1998},
      {id: uid(), name: "Simone, Sebastião's sister", email: "simonesebas@example.com", organization: "Schoolmate Kamaity", year: 1998},
      {id: uid(), name: "Simone, Vanessa's sister", email: "simone_va@example.com", organization: "Schoolmate Kamaity", year: 1998},
      {id: uid(), name: "Vanessa, Simone's sister", email: "vanessa@example.com", organization: "Schoolmate Kamaity", year: 1998},
      {id: uid(), name: "Verônica, Aline's sister", email: "veronica@example.com", organization: "Schoolmate Kamaity", year: 1998},
      {id: uid(), name: "Cristiane Duarte", email: "cristianeduarte@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Dilma", email: "dilma@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Geovana, aka 'Japa'", email: "geovana@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Gislaine Alves, aka 'Gi'", email: "gislainealves@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Jô", email: "jo@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Joice", email: "joice@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Lilian, Cristian's wife", email: "lilian@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Marisa Barcelos", email: "marisabarcelos@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Nilma, Cascata's sister", email: "nilma@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Rosana Gonçalves", email: "rosanagoncalves@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Shirlane Alves, aka 'Nanny'", email: "shirlanealves@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Taynara Ferraz", email: "taynaraferraz@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Alessandra Rosa, aka 'Ale'", email: "alerosa@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Anderson, aka 'Paraíba'", email: "andersonparaiba@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "'Chura'", email: "chura@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Cláudio Jr", email: "claudiojr@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Edimilson Borunk", email: "edimilsonborunk@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Edlaine S. Nobrega", email: "edlainesnobrega@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Edna S. Nobrega", email: "ednasnobrega@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Evandro", email: "evandro@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Janaina", email: "janaina@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Jéssica Aquino", email: "jessicaaquino@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "João Ramos", email: "joaoramos@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Leandro, aka 'Lelê'", email: "leandro@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "'Mexicano'", email: "mexicano@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Priscila Martins", email: "priscilamartins@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Samuel, aka 'Samuca'", email: "samuelsamuca@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Serginho", email: "serginho@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Valéria", email: "valeria@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Vanderson, aka 'Berimbal'", email: "vandersonberimbal@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Adilson", email: "adilson@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Cibele Mota", email: "cibelemota@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Cristian, Lilian husband", email: "cristian@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Fabiana Fonseca", email: "fabianafonseca@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Luciana", email: "luciana@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Marcelo, aka 'Cachorrão' (in memoriam)", email: "marcelocachorrao@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Nádia Mota", email: "nadiamota@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Aline Medeiros", email: "aline medeiros@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Érika Avila", email: "erikaavila@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Regiane Passos", email: "regianepassos@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Débora", email: "debora@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Gabi Oliveira", email: "gabioliveira@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Jaqueline", email: "jaqueline@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Jéssica Avila", email: "jessicaavila@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Márcio", email: "marcio@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Paulo Oliveira", email: "paulo oliveira@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Pedro Pedroso", email: "pedropedroso@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Ricardinho", email: "ricardinho@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Rose Oliveira", email: "roseoliveira@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Denis", email: ".@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Edilaine Bonruk", email: "edilainebonruk@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Érika", email: "erika@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Estela", email: "estela@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Genilson, aka 'Telo'", email: "genilsontelo@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Jaqueline Pupo", email: "jaquelinepupo@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Joelma", email: "joelma@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Oscar, aka 'Japa' (in memoriam)", email: "oscarjapa@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Ramon", email: "Ramon@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Talita Pupo", email: "talitapupo@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Cicero", email: "cicero@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Cláudio", email: "claudio@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Edilson (in memoriam)", email: "edilson@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Edinho", email: "edinho@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Edvaldo", email: "edvaldo@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Gilson", email: "gilson@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Sérgio", email: "sergio@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Tadeu", email: "tadeu@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Almir", email: "almir@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Edenilson", email: "edenilson@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Fernando Mota", email: "fernandomota@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "João", email: "Joao@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "João Aquino", email: "joaoaquino@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Luis", email: "luis@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Luis, aka 'Negão'", email: "luisnegao@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Beto", email: "beto@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Jhonatan", email: "jhonatan@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Rogerinho (in memoriam)", email: "rogerinho@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Romarinho", email: "romarinho@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Samuel Ferreira, aka 'Samuca'", email: "samuelferreira@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "'Mita'", email: "mita@example.com", organization: "Supermarket", year: 2009},
      {id: uid(), name: "Daniele Ribeiro dos Santos", email: "danielersantos@example.com", organization: "Unisepe MBA Schoolmate", year: 2017},
      {id: uid(), name: "Gracieny Barbosa", email: "gracienybarbosa@example.com", organization: "Unisepe MBA Schoolmate", year: 2017},
      {id: uid(), name: "Guilherme", email: "guilherme@example.com", organization: "Unisepe MBA Schoolmate", year: 2017},
      {id: uid(), name: "Gustavo Pagani", email: "gustavopagani@example.com", organization: "Unisepe MBA Schoolmate", year: 2017},
      {id: uid(), name: "Kátia Cristina de Pontes", email: "katiacpontes@example.com", organization: "Unisepe MBA Schoolmate", year: 2017},
      {id: uid(), name: "Kelly", email: "kelly@example.com", organization: "Unisepe MBA Schoolmate", year: 2017},
      {id: uid(), name: "Lucas", email: "lucas@example.com", organization: "Unisepe MBA Schoolmate", year: 2017},
      {id: uid(), name: "Matheus E. S. Pedroso", email: "matheusespedroso@example.com", organization: "Unisepe MBA Schoolmate", year: 2017},
      {id: uid(), name: "Tiago da Silva Pinto", email: "tiagospinto@example.com", organization: "Unisepe MBA Schoolmate", year: 2017},
      {id: uid(), name: "Carla Dias", email: "carladias@example.com", organization: "Unisepe ADM Schoolmate", year: 2016},
      {id: uid(), name: "Heloise Cassiano", email: "heloisecassiano@example.com", organization: "Unisepe ADM Schoolmate", year: 2017},
      {id: uid(), name: "Jerusa Leocadio Pupo", email: "jerusalpupo@example.com", organization: "Unisepe ADM Schoolmate", year: 2017},
      {id: uid(), name: "Jessica Mendes Ribeiro", email: "jessicamribeiro@example.com", organization: "Unisepe ADM Schoolmate", year: 2017},
      {id: uid(), name: "Letícia Figueiredo de Lima", email: "leticiaflima@example.com", organization: "Unisepe ADM Schoolmate", year: 2017},
      {id: uid(), name: "Luã Marcus Teixeira", email: "luamteixeira@example.com", organization: "Unisepe ADM Schoolmate", year: 2010},
      {id: uid(), name: "Marcos Vinicius Ramos de Lima", email: "marcosvrlima@example.com", organization: "Unisepe ADM Schoolmate", year: 2016},
      {id: uid(), name: "Renan Amorim Freitas", email: "renanafreitas@example.com", organization: "Unisepe ADM Schoolmate", year: 2016},
      {id: uid(), name: "Samara Gonçalves", email: "samaragoncalves@example.com", organization: "Unisepe ADM Schoolmate", year: 2017},
      {id: uid(), name: "Samuel Gonçalves Jorge", email: "samuelgjorge@example.com", organization: "Unisepe ADM Schoolmate", year: 2017},
      {id: uid(), name: "Aimeê Zanella", email: "aimeezanella@example.com", organization: "Unisepe ADM Schoolmate", year: 2010},
      {id: uid(), name: "Alison Canuto", email: "alisoncanuto@example.com", organization: "Unisepe ADM Schoolmate", year: 2010},
      {id: uid(), name: "Ana Paula Ferreira", email: "anaprerreira@example.com", organization: "Unisepe ADM Schoolmate", year: 2010},
      {id: uid(), name: "Ana Paula Gomes", email: "anapgomes@example.com", organization: "Unisepe ADM Schoolmate", year: 2010},
      {id: uid(), name: "Anderson Mancio", email: "andersonmancio@example.com", organization: "Unisepe ADM Schoolmate", year: 2010},
      {id: uid(), name: "André Gemente", email: "andregemente@example.com", organization: "Unisepe ADM Schoolmate", year: 2010},
      {id: uid(), name: "Angélica Schuz", email: "angelicaschuz@example.com", organization: "Unisepe ADM Schoolmate", year: 2010},
      {id: uid(), name: "Aramis Araújo", email: "aramisaraujo@example.com", organization: "Unisepe ADM Schoolmate", year: 2010},
      {id: uid(), name: "Asafe Valadares", email: "asafevaladares@example.com", organization: "Unisepe ADM Schoolmate", year: 2010},
      {id: uid(), name: "Bruna Corrêa Vidotto", email: "brunacvidotto@example.com", organization: "Unisepe ADM Schoolmate", year: 2010},
      {id: uid(), name: "Bruno Galera", email: "brunogalera@example.com", organization: "Unisepe ADM Schoolmate", year: 2010},
      {id: uid(), name: "Cibele", email: "cibele@example.com", organization: "Unisepe ADM Schoolmate", year: 2010},
      {id: uid(), name: "Elaine Pina", email: "elainepina@example.com", organization: "Unisepe ADM Schoolmate", year: 2010},
      {id: uid(), name: "Jaqueline", email: "jaqueline@example.com", organization: "Unisepe ADM Schoolmate", year: 2010},
      {id: uid(), name: "Jeferson", email: "jeferson@example.com", organization: "Unisepe ADM Schoolmate", year: 2010},
      {id: uid(), name: "Jhenifer Pastor", email: "jheniferpastor@example.com", organization: "Unisepe ADM Schoolmate", year: 2010},
      {id: uid(), name: "Joel", email: "joel@example.com", organization: "Unisepe ADM Schoolmate", year: 2010},
      {id: uid(), name: "Jucinara Alves de Melo", email: "jucinaraamelo@example.com", organization: "Unisepe ADM Schoolmate", year: 2010},
      {id: uid(), name: "Laís Dias", email: "laisdias@example.com", organization: "Unisepe ADM Schoolmate", year: 2010},
      {id: uid(), name: "Luciano Ota", email: "lucianoota@example.com", organization: "Unisepe ADM Schoolmate", year: 2010},
      {id: uid(), name: "Luis Fernando de Oliveira Pupo", email: "luisfopupo@example.com", organization: "Unisepe ADM Schoolmate", year: 2010},
      {id: uid(), name: "Luis Henrique de Oliveira Muniz", email: "luishomuniz@example.com", organization: "Unisepe ADM Schoolmate", year: 2010},
      {id: uid(), name: "Mike Endo", email: "mikeendo@example.com", organization: "Unisepe ADM Schoolmate", year: 2010},
      {id: uid(), name: "Mike Muniz", email: "mikemuniz@example.com", organization: "Unisepe ADM Schoolmate", year: 2010},
      {id: uid(), name: "Patrícia Peroni", email: "patriciaperoni@example.com", organization: "Unisepe ADM Schoolmate", year: 2010},
      {id: uid(), name: "Renan", email: "renan@example.com", organization: "Unisepe ADM Schoolmate", year: 2010},
      {id: uid(), name: "Renata", email: "renata@example.com", organization: "Unisepe ADM Schoolmate", year: 2010},
      {id: uid(), name: "Sabrine Sgorlon", email: "sabrinesgorlon@example.com", organization: "Unisepe ADM Schoolmate", year: 2010},
      {id: uid(), name: "Tais Bruno", email: "taisbruno@example.com", organization: "Unisepe ADM Schoolmate", year: 2010},
      {id: uid(), name: "Taísa Severo", email: "taisasevero@example.com", organization: "Unisepe ADM Schoolmate", year: 2010},
      {id: uid(), name: "Viviane Vargas", email: "vivianevargas@example.com", organization: "Unisepe ADM Schoolmate", year: 2010},
      {id: uid(), name: "Wanderley", email: "wanderley@example.com", organization: "Unisepe ADM Schoolmate", year: 2010},
      {id: uid(), name: "Zayrah Azzurra Dória Muniz", email: "zayrahadmuniz@example.com", organization: "Unisepe ADM Schoolmate", year: 2010},
      {id: uid(), name: "Alana Aparecida da Costa Ferreira", email: "alanaacferreira@example.com", organization: "College Bus", year: 2017},
      {id: uid(), name: "Andressa", email: "andressa@example.com", organization: "College Bus", year: 2014},
      {id: uid(), name: "Caio Félix", email: "caiofelix@example.com", organization: "College Bus", year: 2017},
      {id: uid(), name: "Caique Victor Gonçalves Vilarim", email: "caiquevgvilarim@example.com", organization: "College Bus", year: 2014},
      {id: uid(), name: "Guilherme", email: "guilherme@example.com", organization: "College Bus", year: 2017},
      {id: uid(), name: "Joice Coelho da Silva", email: "joicecsilva@example.com", organization: "College Bus", year: 2017},
      {id: uid(), name: "José Henrique", email: "zehenrique@example.com", organization: "College Bus", year: 2017},
      {id: uid(), name: "Juninho", email: "juninho@example.com", organization: "College Bus", year: 2017},
      {id: uid(), name: "Nathany", email: "nathany@example.com", organization: "College Bus", year: 2017},
      {id: uid(), name: "Sarine de Oliveira", email: "sarineoliveira@example.com", organization: "College Bus", year: 2010},
      {id: uid(), name: "Yulli de Oliveira", email: "yullioliveira@example.com", organization: "College Bus", year: 2010},
      {id: uid(), name: "Alessandra Azevedo", email: "alessandraazevedo@example.com", organization: "Unisepe College", year: 2017},
      {id: uid(), name: "Andressa S. L. Carneiro", email: "andressaslcarneiro@example.com", organization: "Unisepe College", year: 2010},
      {id: uid(), name: "Leonildo M. Jesus", email: "leonildonjesus@example.com", organization: "Unisepe College", year: 2017},
      {id: uid(), name: "Vinicius C. Souza", email: "viniciuscsouza@example.com", organization: "Unisepe College", year: 2010},
      {id: uid(), name: "Beynur A. Oliveira", email: "beynuraoliveira@example.com", organization: "Unisepe College", year: 2016},
      {id: uid(), name: "Weslley M. Silva", email: "weslleymsilva@example.com", organization: "Unisepe College", year: 2017},
      {id: uid(), name: "Mª Juliana Silva", email: "mjulianasilva@example.com", organization: "Unisepe College", year: 2016},
      {id: uid(), name: "Adriany C. Morato", email: "adrianycmorato@example.com", organization: "Unisepe College", year: 2017},
      {id: uid(), name: "André L. Morais", email: "andrelmorais@example.com", organization: "Unisepe College", year: 2017},
      {id: uid(), name: "Roselice C. Azeqvedo", email: "roselicesazeqvedo@example.com", organization: "Unisepe College", year: 2017},
      {id: uid(), name: "Evandro", email: "evandro@example.com", organization: "Unisepe College", year: 2017},
      {id: uid(), name: "Vera J. C. Adorno", email: "verajcadorno@example.com", organization: "Unisepe College", year: 2016},
      {id: uid(), name: "Abigail D. L. Pinto", email: "abigaildlpinto@example.com", organization: "Unisepe College", year: 2010},
      {id: uid(), name: "Anderson M. Silva", email: "andersonmsilva@example.com", organization: "Unisepe College", year: 2016},
      {id: uid(), name: "Andreia A. Barbosa", email: "andreiaabarbosa@example.com", organization: "Unisepe College", year: 2016},
      {id: uid(), name: "Claudio A. Marques", email: "claudioamarques@example.com", organization: "Unisepe College", year: 2016},
      {id: uid(), name: "Deise A. Carminanti", email: "deiseacarminanti@example.com", organization: "Unisepe College", year: 2016},
      {id: uid(), name: "Eliney Sabino", email: "elineysabino@example.com", organization: "Unisepe College", year: 2017},
      {id: uid(), name: "Isabela M. M. Rubia", email: "isabelammrubia@example.com", organization: "Unisepe College", year: 2016},
      {id: uid(), name: "Leoni A. Souza", email: "leoniasouza@example.com", organization: "Unisepe College", year: 2016},
      {id: uid(), name: "Luciano A. Fiscina", email: "lucianoafiscina@example.com", organization: "Unisepe College", year: 2016},
      {id: uid(), name: "Sergio R. B. Belo", email: "sergiorbbelo@example.com", organization: "Unisepe College", year: 2016},
      {id: uid(), name: "Soraia Castellano", email: "soraiacastellano@example.com", organization: "Unisepe College", year: 2016},
      {id: uid(), name: "Vera R. F. Hashimoto", email: "verarfhashimoto@example.com", organization: "Unisepe College", year: 2016},
      {id: uid(), name: "Denis A. Almeida", email: "denisaalmeida@example.com", organization: "Unisepe College", year: 2016},
      {id: uid(), name: "Jersey S. Anacleto", email: "jerseysanacleto@example.com", organization: "Unisepe College", year: 2016},
      {id: uid(), name: "Matheus E. S. Pedroso", email: "matheusespedroso@example.com", organization: "Unisepe College", year: 2016},
      {id: uid(), name: "Alexandre M. Neves", email: "alexandremneves@example.com", organization: "Unisepe College", year: 2016},
      {id: uid(), name: "Gustavo Genaro", email: "gustavogenaro@example.com", organization: "Unisepe College", year: 2017},
      {id: uid(), name: "Robson", email: "robson@example.com", organization: "Unisepe College", year: 2018},
      {id: uid(), name: "Gustavo Barduco", email: "gustavobarduco@example.com", organization: "Unisepe College", year: 2019},
      {id: uid(), name: "Fabiano O. Albers", email: "fabianooalbers@example.com", organization: "Unisepe College", year: 2016},
      {id: uid(), name: "Luis C. S. Muniz", email: "luiscsmuniz@example.com", organization: "Unisepe College", year: 2016},
      {id: uid(), name: "Everton T. M. Macedo", email: "evertontmmacedo@example.com", organization: "Unisepe College", year: 2018},
      {id: uid(), name: "Osvaldo R. Souza", email: "osvaldorsouza@example.com", organization: "Unisepe College", year: 2016},
      {id: uid(), name: "André L. Cugler", email: "andrelcugler@example.com", organization: "Unisepe College", year: 2016},
      {id: uid(), name: "Felipe R. R. Santana", email: "feliperrsantana@example.com", organization: "Unisepe College", year: 2016},
      {id: uid(), name: "Cristiane K. Lima", email: "cristianeklima@example.com", organization: "Unisepe College", year: 2017},
      {id: uid(), name: "Edi V. S. Silva", email: "edivssilva@example.com", organization: "Unisepe College", year: 2010},
      {id: uid(), name: "Eliane P. Almeida", email: "elianepalmeida@example.com", organization: "Unisepe College", year: 2017},
      {id: uid(), name: "Elisandra C. Cunha", email: "elisandraccunha@example.com", organization: "Unisepe College", year: 2016},
      {id: uid(), name: "Flavio P. Silva", email: "flaviopsilva@example.com", organization: "Unisepe College", year: 2016},
      {id: uid(), name: "Pedro I. Oliveira", email: "pedroioliveira@example.com", organization: "Unisepe College", year: 2010},
      {id: uid(), name: "Sabrina", email: "sabrina@example.com", organization: "Unisepe College", year: 2017},
      {id: uid(), name: "Alicia", email: "alicia@example.com", organization: "Unisepe College", year: 2018},
      {id: uid(), name: "Bruna M. Floriano", email: "brunamfloriano@example.com", organization: "Unisepe College", year: 2016},
      {id: uid(), name: "Renata R. Freitas", email: "renatarfreitas@example.com", organization: "Unisepe College", year: 2016},
      {id: uid(), name: "Eduardo Ogawa", email: "eduardoogawa@example.com", organization: "Unisepe College", year: 2016},
      {id: uid(), name: "Octavio Forti Neto", email: "octaviofneto@example.com", organization: "Unisepe College", year: 2014},
      {id: uid(), name: "Eduardo Bomfim Machado", email: "eduardobmachado@example.com", organization: "Unisepe College", year: 2014},
      {id: uid(), name: "Mirlene (in memoriam)", email: "mirlene@example.com", organization: "Unisepe College", year: 2016},
      {id: uid(), name: "Helen Aguiar Muniz", email: "helenamuniz@example.com", organization: "Unisepe College", year: 2010},
      {id: uid(), name: "Mário Sérgio", email: "mariosergio@example.com", organization: "Unisepe College", year: 2010},
      {id: uid(), name: "eduardohalt", email: "eduardohalt@example.com", organization: "Unisepe College", year: 2010},
      {id: uid(), name: "Adelmo", email: "adelmo@example.com", organization: "Unisepe College", year: 2010},
      {id: uid(), name: "Tame Osawa", email: "tameosawa@example.com", organization: "Unisepe College", year: 2010},
      {id: uid(), name: "Narume Abe", email: "narumeabe@example.com", organization: "Unisepe College", year: 2017},
      {id: uid(), name: "Leonardo Torres", email: "leonardotorres@example.com", organization: "Unisepe College", year: 2016},
      {id: uid(), name: "Carlos Eduardo Pinto", email: "carlosepinto@example.com", organization: "Unisepe College", year: 2010},
      {id: uid(), name: "Cristiane Souza", email: "crislavado@example.com", organization: "Unisepe College", year: 2017},
    ];
  }
}

function init(){
  loadState();
  if(!state.lang) state.lang = 'en';
  if(!state.theme) state.theme = 'dark';
  initDefaults();

  $(SELECTORS.langSelect).value = state.lang;
  applyTheme();
  renderTexts();
  bindEvents();
  renderList();

  $(SELECTORS.yearText).textContent = new Date().getFullYear();
}

document.addEventListener('DOMContentLoaded', init);
