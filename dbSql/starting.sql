create schema if not exists profiler;

drop table if exists profiler.entities;

create table if not exists profiler.entities (
  entity_id serial not null,
  entity_type smallint not null,
  entity_name text not null,
  -- ic details 
  ic_type int,
  ic_no text,

  -- contact details
  mobile_no text,
  office_no text,
  email text,

  -- address details
  address1 text,
  address2 text,
  address3 text,
  postcode text,
  address_city text,
  address_state smallint,

  note text,
  constraint pk_entities primary key (entity_id)
);

create table relations (
  parent_id int not null,
  child_id int not null,
  relation_name text,
  note text,
  constraint pk_relations primary key (parent_id, child_id),
  constraint fk_parent_id foreign key (parent_id) references entities(entity_id),
  constraint fk_child_id foreign key (child_id) references entities(entity_id)
);

create table schedules (
  schedule_id serial not null,
  schedule_name text not null,
  schedule_type smallint not null,
  schedule_config json not null,
  recurring interval not null,
  status_code smallint,
  start_date timestamptz not null,
  expiry_date timestamptz,
  constraint pk_schedule_id primary key (schedule_id)
);

create table templates (
  template_id serial not null,
  template_name text,
  template_type smallint,
  config json,
  constraint pk_templates primary key (template_id)
);

create table tasks_email (
  task_id 
)

insert into profiler.entities (entity_type, entity_name) values 
(1, 'Mr. Bean'),
(1, 'Mr. yyy'),
(1, 'Mr. xxx'),
(1, 'Mr. Ben')
