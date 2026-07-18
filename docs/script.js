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
      {id: uid(), name: "Adélia", email: "adelia@example.com", organization: "Kamaity School Teacher", year: 2001},
      {id: uid(), name: "Adosinda C. Mendes", email: "adosindamendes@example.com", organization: "Poet School Teacher", year: 2003},
      {id: uid(), name: "César A. M. Santos", email: "cesaramssantos@example.com", organization: "Poet School Teacher", year: 2004},
      {id: uid(), name: "Cláudia R. Gonçalves", email: "claudiargoncalves@example.com", organization: "Poet School Teacher", year: 2002},
      {id: uid(), name: "Dani F. de Carvalho", email: "danifdecarvalho@example.com", organization: "Poet School Teacher", year: 2006},
      {id: uid(), name: "Edi Isabel C. Leite", email: "ediisabelcleite@example.com", organization: "Poet School Teacher", year: 2002},
      {id: uid(), name: "Izabel Bezerra S. Mota", email: "izabelbezerrasmota@example.com", organization: "Poet School Teacher", year: 2002},
      {id: uid(), name: "José Milton D. Souza", email: "josemiltondsouza@example.com", organization: "Poet School Teacher", year: 2006},
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
      {id: uid(), name: "Aurea", email: "aurea.@example.com", organization: "Kamaity School Employee", year: 1998},
      {id: uid(), name: "Maria Nelson", email: "marianelson.@example.com", organization: "Kamaity School Employee", year: 1998},
      {id: uid(), name: "João R. Fortes", email: "joaorfortes.@example.com", organization: "Poet School Employee", year: 2002},
      {id: uid(), name: "Juliana B. Carvalho", email: "julianabcarvalho.@example.com", organization: "Poet School Employee", year: 2002},
      {id: uid(), name: "Marlene G. Lopes", email: "marleneglopes.@example.com", organization: "Poet School Employee", year: 2002},
      {id: uid(), name: "Marta C. G. Silva", email: "martacgsilva.@example.com", organization: "Poet School Employee", year: 2002},
      {id: uid(), name: "Marta R. Raquel", email: "martarraquel.@example.com", organization: "Poet School Employee", year: 2002},
      {id: uid(), name: "Milton Capizani", email: "miltoncapizani.@example.com", organization: "Poet School Employee", year: 2002},
      {id: uid(), name: "Neusa Ap. de Jesus", email: "neusaapdejesus.@example.com", organization: "Poet School Employee", year: 2002},
      {id: uid(), name: "Neusa C. D. Cardoso", email: "neusacdcardsoso.@example.com", organization: "Poet School Employee", year: 2002},
      {id: uid(), name: "Norma R. G. Porfírio", email: "normargporfírio.@example.com", organization: "Poet School Employee", year: 2002},
      {id: uid(), name: "Olga M. Tanaka", email: "olgamtanaka.@example.com", organization: "Poet School Employee", year: 2002},
      {id: uid(), name: "Silene G. C. Leal", email: "silenegcleal.@example.com", organization: "Poet School Employee", year: 2002},
      {id: uid(), name: "Tânia Mª R. Almeida", email: "taniamralmeida.@example.com", organization: "Poet School Employee", year: 2002},
      {id: uid(), name: "Jorge B. Benedito", email: "jorgebbenedito.@example.com", organization: "Poet School Master", year: 2002},
      {id: uid(), name: "Iolanda B. V. Bugança", email: "iolandabvbugança.@example.com", organization: "Poet School Master", year: 2002},
      {id: uid(), name: "Antonio Cunha", email: "antoniocunha.@example.com", organization: "Poet School Master", year: 2002},
      {id: uid(), name: "Alan Bruno Gonzaga Costa", email: "alanbrunogonzagacosta.@example.com", organization: "Schoolmate Poet", year: 2004},
      {id: uid(), name: "Alex Reis", email: "alexreis.@example.com", organization: "Schoolmate Poet", year: 2004},
      {id: uid(), name: "Andressa Oliveira de Santana", email: "andressaoliveiradesantana.@example.com", organization: "Schoolmate Poet", year: 2004},
      {id: uid(), name: "Bruna Batistela de França", email: "brunabatisteladefrança.@example.com", organization: "Schoolmate Poet", year: 2005},
      {id: uid(), name: "Bruno Ferreira França", email: "brunoferreirafança.@example.com", organization: "Schoolmate Poet", year: 2004},
      {id: uid(), name: "Durvalino Floriano", email: "durvalinofloriano.@example.com", organization: "Schoolmate Poet", year: 2004},
      {id: uid(), name: "Fabiano Oliveira dos Passos", email: "fabianooliveiradospassos.@example.com", organization: "Schoolmate Poet", year: 2004},
      {id: uid(), name: "Felipe Gomes Ferreira", email: "felipegomesferreira.@example.com", organization: "Schoolmate Poet", year: 2004},
      {id: uid(), name: "Juliana Maria Ramos", email: "julianamariaramos.@example.com", organization: "Schoolmate Poet", year: 2004},
      {id: uid(), name: "Leandro Oliveira Fontes Silva", email: "leandrooliveirafontessilva.@example.com", organization: "Schoolmate Poet", year: 2004},
      {id: uid(), name: "Mariane Ferraz M. Almeida", email: "marianeferrazmalmeida.@example.com", organization: "Schoolmate Poet", year: 2004},
      {id: uid(), name: "Neto", email: "neto.@example.com", organization: "Schoolmate Poet", year: 2004},
      {id: uid(), name: "Newton Franco M. Junior", email: "newtonfrancomjunior.@example.com", organization: "Schoolmate Poet", year: 2004},
      {id: uid(), name: "Nubia Daiane da Silva", email: "nubiadaienedasilva.@example.com", organization: "Schoolmate Poet", year: 2004},
      {id: uid(), name: "Tais Fernandes de Souza", email: "taisfernandesdesouza.@example.com", organization: "Schoolmate Poet", year: 2004},
      {id: uid(), name: "William", email: "william.@example.com", organization: "Schoolmate Poet", year: 2004},
      {id: uid(), name: "Alcides José Valentim de Deus, aka 'Formigão'", email: "alcidesformigao.@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Alex Floriano Pinto, aka 'Cavalo'", email: "alexflorianopinto.@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Bruna Silva", email: "brunasilva.@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Daniel", email: "daniel.@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Edilson de Souza Bonruk, aka 'Bauduco'", email: "edilsondesouzabonruk.@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Emerson Rodrigues F. Pereira, aka 'Minho'", email: "emersonrodriguesfpereira.@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Gilda, Telo's sister", email: "gilda.@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Gilmar", email: "gilmar.@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Janaina Neves Bento", email: "janainanbento.@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Jeferson Severiano S. Carvalho, aka 'Neno'", email: "jefersonneno.@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Jéssica Teixeira", email: "jessicateixeira.@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Julianne dos Santos Silva", email: "juliannessilva.@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Kelly da Cruz", email: "kellycruz.@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Leonardo Bispo Ribeiro, aka 'Léo'", email: "leonardobisporibeiro.@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Marcelo L. Borba", email: "marcelolborba.@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Maria Aparecida dos Santos", email: "mariaassantos.@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Rita de Cassia Paula da Silva", email: "ritacpsilva.@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Rodrigo Pires dos Santos, aka 'Mané'", email: "rodrigopsantos.@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Simone da Cunha Domingues", email: "simonecdomingues.@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Suelen", email: "suelen.@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Tatiana Nunes", email: "tatiananunes.@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Tiago Fernandes", email: "tiagofernandes.@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Veronica Gonçalves da Silva", email: "veronicagsilva.@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Welligton Rodrigues", email: "welligtonrodrigues.@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Welligton Tobias", email: "welligtontobias.@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Alan Willian F. Silva", email: "alanwfsilva.@example.com", organization: "Schoolmate Poet", year: 2006},
      {id: uid(), name: "Alexandre Silva Lima, aka 'Gordão'", email: "alexandreslima.@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Arivil", email: "arivil.@example.com", organization: "Schoolmate Poet", year: 2007},
      {id: uid(), name: "Bruno Vieira de Santana, aka 'Repolho'", email: "brunovsantana.@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Fernando", email: "fernando.@example.com", organization: "Schoolmate Poet", year: 2007},
      {id: uid(), name: "José Augusto", email: "joseaugusto.@example.com", organization: "Schoolmate Poet", year: 2007},
      {id: uid(), name: "Luan Bernardo, aka 'Bilu'", email: "luanbernardo.@example.com", organization: "Schoolmate Poet", year: 2007},
      {id: uid(), name: "Luiz Guilherme Bernardo, aka 'Lugui'", email: "luizgbernardo.@example.com", organization: "Schoolmate Poet", year: 2006},
      {id: uid(), name: "Robson Fernandes", email: "robsonfernandes.@example.com", organization: "Schoolmate Poet", year: 2006},
      {id: uid(), name: "Robson Florindo", email: "robsonflorindo.@example.com", organization: "Schoolmate Poet", year: 2006},
      {id: uid(), name: "Adriana", email: "adriana.@example.com", organization: "Schoolmate Poet", year: 2007},
      {id: uid(), name: "Amanda Gabriela Queiroz Ribeiro", email: "amandagqribeiro.@example.com", organization: "Schoolmate Poet", year: 2007},
      {id: uid(), name: "Ariane Rodrigues Batistela", email: "arianerbatistela.@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Carol Lara", email: "carollara.@example.com", organization: "Schoolmate Poet", year: 2007},
      {id: uid(), name: "Daniele Silva dos Santos", email: "danielessantos.@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Dayane Almeida", email: "dayanealmeida.@example.com", organization: "Schoolmate Poet", year: 2006},
      {id: uid(), name: "Denifer Canuto de Oliveira", email: "denifercoliveira.@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Edlaine da Silva Nobrega", email: "edlainesnobrega.@example.com", organization: "Schoolmate Poet", year: 2007},
      {id: uid(), name: "Edna da Silva Nobrega", email: "ednadsnobrega.@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Erika Bianchi", email: "erikabianchi.@example.com", organization: "Schoolmate Poet", year: 2007},
      {id: uid(), name: "Fernanda Santos", email: "fernandasantos.@example.com", organization: "Schoolmate Poet", year: 2007},
      {id: uid(), name: "Jessica do Prado Raimundo", email: "jessicapraimundo.@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Jessica Lara", email: "jessicalara.@example.com", organization: "Schoolmate Poet", year: 2007},
      {id: uid(), name: "Juliana Tavares da Silva", email: "julianatavares.@example.com", organization: "Schoolmate Poet", year: 2007},
      {id: uid(), name: "Julie Moraes Silva", email: "juliemoraes.@example.com", organization: "Schoolmate Poet", year: 2007},
      {id: uid(), name: "Márcia", email: "marcia.@example.com", organization: "Schoolmate Poet", year: 2007},
      {id: uid(), name: "Milena Cassiano", email: "milenacassiano.@example.com", organization: "Schoolmate Poet", year: 2007},
      {id: uid(), name: "Priscila Martins", email: "priscilamartins.@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Rosa Macedo", email: "rosamacedo.@example.com", organization: "Schoolmate Poet", year: 2007},
      {id: uid(), name: "Rosemary", email: "rosemary.@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Talita Pupo Pupo", email: "talitapupo.@example.com", organization: "Schoolmate Poet", year: 2007},
      {id: uid(), name: "Thais de Oliveira Antunes", email: "thaisoliveira.@example.com", organization: "Schoolmate Poet", year: 2002},
      {id: uid(), name: "Thayná", email: "thayna.@example.com", organization: "Schoolmate Poet", year: 2007},
      {id: uid(), name: "Thuany", email: "thuany.@example.com", organization: "Schoolmate Poet", year: 2007},
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
