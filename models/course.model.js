const db = require('../config/db');
const tbl_courses = `courses`;
const tbl_subjects = `subjects`;
const tbl_categories = `categories`;
const tbl_orders_details = `orders_details`;
const tbl_instructor_courses_uploaded = `instructor_courses_uploaded`;
const tbl_users = `users`;
const tbl_chapters = `chapters`;
const tbl_lessons = `lessons`;
const tbl_course_reviews = `course_reviews`;
const tbl_roles = `roles`;
const tbl_student_enrolls = `student_enrolls`;
const tbl_sales = `sales`;

const courseModel = {
  all() {
    const sql = `select * from ${tbl_courses} `;
    return db.load(sql);
  },

  add(entity) {
    return db.add(entity, tbl_courses);
  },
  allSales() {
    const sql = `select * from ${tbl_sales}; `;
    return db.load(sql);
  },

  allWithFinished() {
    const sql = `select * from ${tbl_courses} c
    where c.is_finished = true `;
    return db.load(sql);
  },
  allWithNoPagi() {
    const sql = `select c.course_id, c.course_name, c.course_title, c.course_avatar_url,
    c.course_fee, c.course_last_updated, c.is_finished, c.views, sj.subject_id, sj.subject_name,
    u.user_id, u.user_name, rt.avg_rate
    from ${tbl_courses} c
    left join ${tbl_subjects} sj
    on sj.subject_id = c.subject_id
    left join ${tbl_instructor_courses_uploaded} ins
    on ins.course_id = c.course_id
    left join ${tbl_users} u
    on u.user_id = ins.user_id
    left join (
    select *, avg(star) as avg_rate
    from course_reviews crw 
    group by crw.course_id
    ) rt
    on rt.course_id = c.course_id
    where c.is_finished = true
    group by c.course_id
     ; `;
    return db.load(sql);
  },
  allWithPagi(limit, offset) {
    const sql = `select c.course_id, c.course_name, c.course_title, c.course_avatar_url,
    c.course_fee, c.course_last_updated, c.is_finished, c.views, sj.subject_id, sj.subject_name,
    u.user_id, u.user_name, rt.avg_rate
    from ${tbl_courses} c
    left join ${tbl_subjects} sj
    on sj.subject_id = c.subject_id
    left join ${tbl_instructor_courses_uploaded} ins
    on ins.course_id = c.course_id
    left join ${tbl_users} u
    on u.user_id = ins.user_id
    left join (
    select *, avg(star) as avg_rate
    from course_reviews crw 
    group by crw.course_id
    ) rt
    on rt.course_id = c.course_id
    where c.is_finished = true
    group by c.course_id
    limit ${limit}
    offset ${offset} ; `;
    return db.load(sql);
  },

  allCourseBySubCatNoPagi(sub_cat) {
    const sql = `select c.course_id, c.course_name, c.course_title, c.course_avatar_url,
    c.course_fee, c.course_last_updated, c.is_finished, c.views, sj.subject_id, sj.subject_name,
    u.user_id, u.user_name, rt.avg_rate
    from ${tbl_courses} c
    left join ${tbl_subjects} sj
    on sj.subject_id = c.subject_id
    left join ${tbl_instructor_courses_uploaded} ins
    on ins.course_id = c.course_id
    left join ${tbl_users} u
    on u.user_id = ins.user_id
    left join (
    select *, avg(star) as avg_rate
    from course_reviews crw 
    group by crw.course_id
    ) rt
    on rt.course_id = c.course_id
    where sj.subject_name = '${sub_cat}'
    and c.is_finished = true
    group by c.course_id;`;
    return db.load(sql);
  },
  allCourseBySubCatPagi(sub_cat, limit, offset) {
    const sql = `select c.course_id, c.course_name, c.course_title, c.course_avatar_url,
    c.course_fee, c.course_last_updated, c.is_finished, c.views, sj.subject_id, sj.subject_name,
    u.user_id, u.user_name, rt.avg_rate
    from ${tbl_courses} c
    left join ${tbl_subjects} sj
    on sj.subject_id = c.subject_id
    left join ${tbl_instructor_courses_uploaded} ins
    on ins.course_id = c.course_id
    left join ${tbl_users} u
    on u.user_id = ins.user_id
    left join (
    select *, avg(star) as avg_rate
    from course_reviews crw 
    group by crw.course_id
    ) rt
    on rt.course_id = c.course_id
    where sj.subject_name = '${sub_cat}'
    and c.is_finished = true
    group by c.course_id
    limit ${limit}
    offset ${offset} ;`;
    return db.load(sql);
  },
  async detail(course_id) {
    const sql = `select c.course_id, c.course_name, c.course_title, 
    c.course_thumbnail, c.course_avatar_url, c.course_fee ,
    c.course_full_description, c.course_short_description,
    c.course_last_updated, c.is_finished, c.subject_id,c.views ,
    sj.subject_name,  u.user_name, u.user_id
    from ${tbl_courses} c 
    left join ${tbl_subjects} sj 
    on sj.subject_id = c.subject_id
    left join ${tbl_instructor_courses_uploaded} i
    on i.course_id = c.course_id
    left join ${tbl_users} u
    on u.user_id = i.user_id
    where c.course_id = ${course_id}
    and c.is_finished = true ;`;
    const ret = await db.load(sql);
    return ret[0];
  },

  async singleByCourseName(course_name) {
    const sql = `select * from ${tbl_courses} as c
    where c.course_name = '${course_name}'`;
    const ret = await db.load(sql);
    return ret[0];
  },

  del(condition) {
    return db.del(condition, tbl_courses);
  },
  edit(entity, condition) {
    return db.edit(entity, condition, tbl_courses);
  },

  getOutstandingCourse() {
    const sql = `select c.course_id, c.course_name, c.course_avatar_url, c.course_fee,
    c.views, c.course_last_updated, c.is_finished, sj.subject_id,  rt.avg_rate,
    sj.subject_name, ins.user_id, u.user_name, sal.sale_percent, ste.num_stu_enroll
   
    from ${tbl_courses} c
    left join ${tbl_subjects} sj
    on sj.subject_id = c.subject_id 
    left join ${tbl_instructor_courses_uploaded} ins
    on ins.course_id = c.course_id
    left join ${tbl_users} u
    on u.user_id = ins.user_id
    left join (
    select *, avg(star) as avg_rate
    from course_reviews crw
    group by crw.course_id
    ) rt
    on rt.course_id = c.course_id 
    left join ${tbl_sales} sal 
    on sal.course_id = c.course_id
    left join (
    select *,count(*) as num_stu_enroll
    from ${tbl_student_enrolls} ste
    group by ste.course_id
    ) ste
    on ste.course_id = c.course_id
    group by c.course_id 
    limit 3
    ;`;

    return db.load(sql);
  },
  tenNewestCourses() {
    const sql = `select c.course_id, c.course_name, c.course_title,
     c.course_avatar_url, c.course_fee, 
    sj.subject_id, sj.subject_name, c.views, u.user_id, u.user_name, c.course_last_updated
    from ${tbl_courses} c
    left join ${tbl_subjects} sj
    on sj.subject_id = c.subject_id
    left join ${tbl_instructor_courses_uploaded} ins
    on ins.course_id = c.course_id
    left join ${tbl_users} u
    on u.user_id = ins.user_id
    where c.is_finished = 1
    group by c.course_id
    order by c.course_last_updated desc
    limit 10;
      `;

    return db.load(sql);
  },
  tenMostViewedCourses() {
    const sql = `select c.course_id, c.course_name, c.course_title, 
    c.course_avatar_url, c.course_fee,
    c.course_last_updated, c.is_finished, c.views, sj.subject_name, u.user_id,
    u.user_name, rt.avg_rate
    from ${tbl_courses} c 
    left join ${tbl_subjects} sj
    on sj.subject_id = c.subject_id
    left join ${tbl_instructor_courses_uploaded} ins 
    on ins.course_id = c.course_id 
    left join ${tbl_users} u
    on u.user_id = ins.user_id
    left join (
    select *, avg(cr.star) as avg_rate
    from course_reviews cr
    group by cr.course_id
    ) rt
    on rt.course_id = c.course_id
    where c.is_finished = 1
    group by c.course_id
    order by c.views desc 
    limit 10;
      `;
    return db.load(sql);
  },
  topSubCat() {
    const sql = `select  count(*) as num_student_enroll,
    cat.cat_name, sj.subject_id, sj.subject_name, c.course_id 
    from ${tbl_student_enrolls} se 
    left join ${tbl_courses} c 
    on c.course_id = se.course_id 
    left join ${tbl_subjects} sj
    on sj.subject_id = c.subject_id
    left join ${tbl_categories} cat 
    on cat.cat_id = sj.cat_id
    group by se.course_id
    order by num_student_enroll desc ;`;
    return db.load(sql);
  },
  detailCourseSyllabus(course_id) {
    const sql = `select l.lesson_id, l.lesson_name, l.lesson_content,
     l.flag_reviewable, l.duration
    , ct.chap_id, ct.chap_name
    from ${tbl_courses} c
    left join ${tbl_chapters} ct
    on ct.course_id = c.course_id
    left join ${tbl_lessons} l
    on l.chap_id = ct.chap_id 
    where c.course_id = ${course_id};
    `;
    return db.load(sql);
  },
  allChapters(course_id) {
    const sql = `select *
    from ${tbl_chapters} c
    where c.course_id = ${course_id} ;`;
    return db.load(sql);
  },
  allLessons(course_id) {
    const sql = `select l.lesson_id, l.lesson_name, l.lesson_content, l.flag_reviewable
    , l.duration, l.chap_id, c.chap_name, c.course_id
    from ${tbl_lessons} l
    left join ${tbl_chapters} c 
    on c.chap_id = l.chap_id
    where c.course_id = ${course_id};
    `;
    return db.load(sql);
  },

  detailCourseInstructor(course_id) {
    const sql = `select ic.course_id, ic.uploaded_day, u.user_name,
     u.email, u.role_id, u.user_avatar_url, r.role_name
    from ${tbl_courses} c
    left join ${tbl_instructor_courses_uploaded} ic
    on ic.course_id = c.course_id
    left join ${tbl_users} u
    on u.user_id = ic.user_id
    left join ${tbl_roles} r
    on r.role_id = u.role_id
    where c.course_id = ${course_id};
    `;
    return db.load(sql);
  },
  detailFiveRelativeCourseBoughtTheMost(course_id, subject_id) {
    const sql = `select c.course_id, c.course_name, c.course_title
    , c.course_thumbnail, c.course_avatar_url, c.course_fee ,
    c.course_full_description, c.course_short_description
    ,c.course_last_updated, c.is_finished, c.subject_id,c.views 
    ,sj.subject_name, scb.num_stu_bought, u.user_name, rt.avg_rate
    from ${tbl_courses} c
    left join ${tbl_subjects} sj
    on sj.subject_id = c.subject_id
    left join ${tbl_instructor_courses_uploaded} ins 
    on ins.course_id = c.course_id
    left join ${tbl_users} u 
    on u.user_id = ins.user_id
    left join (
      select *, avg(star) avg_rate
      from ${tbl_course_reviews} crw
      group by crw.course_id
    ) rt
    on rt.course_id = c.course_id
    left join (
    select * , count(*) num_stu_bought
    from ${tbl_orders_details} scb 
    group by scb.course_id
    having count(scb.course_id) > 0
    order by count(scb.course_id) desc
    ) scb
    on scb.course_id = c.course_id
    where sj.subject_id = ${subject_id}
    and c.is_finished = true
    and c.course_id != ${course_id}
    group by c.course_id
    order by scb.num_stu_bought desc
    limit 5;
    `;
    return db.load(sql);
  },

  detailCourseReviews(course_id) {
    const sql = `select cr.course_id,c.course_name, cr.star, cr.review_content
    ,u.user_id, u.user_name, u.user_avatar_url, u.role_id, r.role_name
    from ${tbl_courses} c
    left join ${tbl_course_reviews} cr
    on cr.course_id = c.course_id
    left join ${tbl_users} u
    on u.user_id = cr.user_id
    left join ${tbl_roles} r
    on u.role_id = r.role_id
    where c.course_id = ${course_id};`;
    return db.load(sql);
  },

  fullTextByName(name, limit, offset) {
    const sql = `select c.course_id, c.course_name, c.course_title, c.course_avatar_url,
    c.course_fee, c.course_last_updated, c.is_finished, c.views, sj.subject_id, sj.subject_name,
    u.user_id, u.user_name, rt.avg_rate
    from ${tbl_courses} c 
    left join ${tbl_subjects} sj
    on sj.subject_id = c.subject_id
    left join ${tbl_instructor_courses_uploaded} ins
    on ins.course_id = c.course_id
    left join ${tbl_users} u
    on u.user_id = ins.user_id
    left join (
    select *, avg(star) as avg_rate
    from course_reviews crw 
    group by crw.course_id
    ) rt
    on rt.course_id = c.course_id
    where match(c.course_name)
    against ('${name}' in natural language mode)
    and c.is_finished = true
    group by c.course_id
    limit ${limit}
    offset ${offset}; `;
    return db.load(sql);
  },
  fullTextBySubcat(subcat, limit, offset) {
    const sql = `select c.course_id, c.course_name, c.course_title, c.course_avatar_url,
    c.course_fee, c.course_last_updated, c.is_finished, c.views, sj.subject_id, sj.subject_name,
    u.user_id, u.user_name, rt.avg_rate
    from ${tbl_courses} c 
    left join ${tbl_subjects} sj
    on sj.subject_id = c.subject_id
    left join ${tbl_instructor_courses_uploaded} ins
    on ins.course_id = c.course_id
    left join ${tbl_users} u
    on u.user_id = ins.user_id
    left join (
    select *, avg(star) as avg_rate
    from course_reviews crw 
    group by crw.course_id
    ) rt
    on rt.course_id = c.course_id
    where match(sj.subject_name)
    against ('${subcat}' in natural language mode)
    and c.is_finished = true
    group by c.course_id
    limit ${limit}
    offset ${offset}; `;
    return db.load(sql);
  },
  fullTextSearchNoPagi(text) {
    const sql = `select c.course_id, c.course_name, c.course_title, c.course_avatar_url,
    c.course_fee, c.course_last_updated, c.is_finished, c.views, sj.subject_id, sj.subject_name,
    u.user_id, u.user_name, rt.avg_rate
    from ${tbl_courses} c 
    left join ${tbl_subjects} sj
    on sj.subject_id = c.subject_id
    left join ${tbl_instructor_courses_uploaded} ins
    on ins.course_id = c.course_id
    left join ${tbl_users} u
    on u.user_id = ins.user_id
    left join (
    select *, avg(star) as avg_rate
    from course_reviews crw 
    group by crw.course_id
    ) rt
    on rt.course_id = c.course_id
    where match(sj.subject_name)
    against ('${text}' in natural language mode)
    or  match(sj.subject_name)
    against ('${text}' in natural language mode)
    and c.is_finished = true
    group by c.course_id
    `;
    return db.load(sql);
  },
  fullTextSearchPagi(text, limit, offset) {
    const sql = `select c.course_id, c.course_name, c.course_title, c.course_avatar_url,
    c.course_fee, c.course_last_updated, c.is_finished, c.views, sj.subject_id, sj.subject_name,
    u.user_id, u.user_name, rt.avg_rate
    from ${tbl_courses} c 
    left join ${tbl_subjects} sj
    on sj.subject_id = c.subject_id
    left join ${tbl_instructor_courses_uploaded} ins
    on ins.course_id = c.course_id
    left join ${tbl_users} u
    on u.user_id = ins.user_id
    left join (
    select *, avg(star) as avg_rate
    from course_reviews crw 
    group by crw.course_id
    ) rt
    on rt.course_id = c.course_id
    where match(c.course_name)
    against ('${text}' in natural language mode)
    or  match(sj.subject_name)
    against ('${text}' in natural language mode)
    and c.is_finished = true
    group by c.course_id
    limit ${limit}
    offset ${offset}; `;
    return db.load(sql);
  },
  byRateASCNoPagi() {
    const sql = `select c.course_id, c.course_name, c.course_title, c.course_avatar_url,
    c.course_fee, c.course_last_updated, c.is_finished, c.views, sj.subject_name,
    ins.user_id, u.user_name, rt.avg_rate
    from ${tbl_courses} c
    left join ${tbl_subjects} sj
    on sj.subject_id = c.subject_id
    left join ${tbl_instructor_courses_uploaded} ins
    on ins.course_id = c.course_id
    left join ${tbl_users} u
    on u.user_id = ins.user_id 
    left join (
    select *, avg(star) as avg_rate
    from course_reviews crw
    group by crw.course_id
    ) rt
    on rt.course_id = c.course_id 
    where c.is_finished = true
    group by c.course_id
    order by rt.avg_rate asc;`;
    return db.load(sql);
  },
  byRateASCPagi(limit, offset) {
    const sql = `select c.course_id, c.course_name, c.course_title, c.course_avatar_url,
    c.course_fee, c.course_last_updated, c.is_finished, c.views, sj.subject_name,
    ins.user_id, u.user_name, rt.avg_rate
    from ${tbl_courses} c
    left join ${tbl_subjects} sj
    on sj.subject_id = c.subject_id
    left join ${tbl_instructor_courses_uploaded} ins
    on ins.course_id = c.course_id
    left join ${tbl_users} u
    on u.user_id = ins.user_id 
    left join (
    select *, avg(star) as avg_rate
    from course_reviews crw
    group by crw.course_id
    ) rt
    on rt.course_id = c.course_id 
    where c.is_finished = true
    group by c.course_id
    order by rt.avg_rate asc
    limit ${limit}
    offset ${offset};`;
    return db.load(sql);
  },
  byRateDESCNoPagi() {
    const sql = `select c.course_id, c.course_name, c.course_title, c.course_avatar_url,
    c.course_fee, c.course_last_updated, c.is_finished, c.views, sj.subject_name,
    ins.user_id, u.user_name, rt.avg_rate
    from ${tbl_courses} c
    left join ${tbl_subjects} sj
    on sj.subject_id = c.subject_id
    left join ${tbl_instructor_courses_uploaded} ins
    on ins.course_id = c.course_id
    left join ${tbl_users} u
    on u.user_id = ins.user_id 
    left join (
    select *, avg(star) as avg_rate
    from course_reviews crw
    group by crw.course_id
    ) rt
    on rt.course_id = c.course_id 
    where c.is_finished = true
    group by c.course_id
    order by rt.avg_rate desc;`;
    return db.load(sql);
  },
  byRateDESCPagi(limit, offset) {
    const sql = `select c.course_id, c.course_name, c.course_title, c.course_avatar_url,
    c.course_fee, c.course_last_updated, c.is_finished, c.views, sj.subject_name,
    ins.user_id, u.user_name, rt.avg_rate
    from ${tbl_courses} c
    left join ${tbl_subjects} sj
    on sj.subject_id = c.subject_id
    left join ${tbl_instructor_courses_uploaded} ins
    on ins.course_id = c.course_id
    left join ${tbl_users} u
    on u.user_id = ins.user_id 
    left join (
    select *, avg(star) as avg_rate
    from course_reviews crw
    group by crw.course_id
    ) rt
    on rt.course_id = c.course_id 
    where c.is_finished = true
    group by c.course_id
    order by rt.avg_rate desc
    limit ${limit}
    offset ${offset};`;
    return db.load(sql);
  },
  byPriceASCNoPagi() {
    const sql = `select c.course_id, c.course_name, c.course_title, c.course_avatar_url,
    c.course_fee, c.course_last_updated, c.is_finished, c.views, sj.subject_name,
    ins.user_id, u.user_name, rt.avg_rate
    from ${tbl_courses} c
    left join ${tbl_subjects} sj
    on sj.subject_id = c.subject_id
    left join ${tbl_instructor_courses_uploaded} ins
    on ins.course_id = c.course_id
    left join ${tbl_users} u
    on u.user_id = ins.user_id 
    left join (
    select *, avg(star) as avg_rate
    from course_reviews crw
    group by crw.course_id
    ) rt
    on rt.course_id = c.course_id 
    where c.is_finished = true
    group by c.course_id
    order by c.course_fee asc;`;
    return db.load(sql);
  },
  byPriceASCPagi(limit, offset) {
    const sql = `select c.course_id, c.course_name, c.course_title, c.course_avatar_url,
    c.course_fee, c.course_last_updated, c.is_finished, c.views, sj.subject_name,
    ins.user_id, u.user_name, rt.avg_rate
    from ${tbl_courses} c
    left join ${tbl_subjects} sj
    on sj.subject_id = c.subject_id
    left join ${tbl_instructor_courses_uploaded} ins
    on ins.course_id = c.course_id
    left join ${tbl_users} u
    on u.user_id = ins.user_id 
    left join (
    select *, avg(star) as avg_rate
    from course_reviews crw
    group by crw.course_id
    ) rt
    on rt.course_id = c.course_id 
    where c.is_finished = true
    group by c.course_id
    order by c.course_fee asc
    limit ${limit}
    offset ${offset};`;
    return db.load(sql);
  },
  byPriceDESCNoPagi() {
    const sql = `select c.course_id, c.course_name, c.course_title, c.course_avatar_url,
    c.course_fee, c.course_last_updated, c.is_finished, c.views, sj.subject_name,
    ins.user_id, u.user_name, rt.avg_rate
    from ${tbl_courses} c
    left join ${tbl_subjects} sj
    on sj.subject_id = c.subject_id
    left join ${tbl_instructor_courses_uploaded} ins
    on ins.course_id = c.course_id
    left join ${tbl_users} u
    on u.user_id = ins.user_id 
    left join (
    select *, avg(star) as avg_rate
    from course_reviews crw
    group by crw.course_id
    ) rt
    on rt.course_id = c.course_id 
    where c.is_finished = true
    group by c.course_id
    order by c.course_fee desc;`;
    return db.load(sql);
  },
  byPriceDESCPagi(limit, offset) {
    const sql = `select c.course_id, c.course_name, c.course_title, c.course_avatar_url,
    c.course_fee, c.course_last_updated, c.is_finished, c.views, sj.subject_name,
    ins.user_id, u.user_name, rt.avg_rate
    from ${tbl_courses} c
    left join ${tbl_subjects} sj
    on sj.subject_id = c.subject_id
    left join ${tbl_instructor_courses_uploaded} ins
    on ins.course_id = c.course_id
    left join ${tbl_users} u
    on u.user_id = ins.user_id 
    left join (
    select *, avg(star) as avg_rate
    from course_reviews crw
    group by crw.course_id
    ) rt
    on rt.course_id = c.course_id 
    where c.is_finished = true
    group by c.course_id
    order by c.course_fee desc
    limit ${limit}
    offset ${offset};`;
    return db.load(sql);
  },

  async detailCatPriceNum(course_id) {
    const sql = `select c.course_id, sj.subject_name, 
    c.course_fee, sal.sale_percent,
    rt.avg_rate, num_stu.num_stu_rate, num_stu_en.num_stu_enrolls
    from ${tbl_courses} c
    left join ${tbl_subjects} sj
    on sj.subject_id = c.subject_id
    left join ${tbl_instructor_courses_uploaded} ins
    on ins.course_id = c.course_id
    left join ${tbl_users} u
    on u.user_id = ins.user_id 
    left join (
    select *, avg(star) as avg_rate
    from course_reviews crw
    group by crw.course_id
    ) rt
    on rt.course_id = c.course_id 
    left join ${tbl_sales} sal
    on sal.course_id = c.course_id
    left join (
    select *, count(*) as num_stu_rate 
    from ${tbl_course_reviews} crw
    group by crw.course_id
    ) num_stu
    on num_stu.course_id = c.course_id
    left join (
    select *, count(*) as num_stu_enrolls 
    from ${tbl_student_enrolls} ste
    group by ste.course_id
    ) num_stu_en
    on num_stu_en.course_id = c.course_id
    where c.is_finished = true
    and c.course_id = ${course_id}`;
    const ret = await db.load(sql);

    return ret[0];
  },

  mostStudentEnroll() {
    const sql = `select c.course_id, c.course_name, c.course_avatar_url, c.course_fee,
    c.views, c.course_last_updated, c.is_finished, sj.subject_id, 
    sj.subject_name, ins.user_id, u.user_name, sal.sale_percent, ste.num_stu_enroll
    from ${tbl_courses} c
    left join ${tbl_subjects} sj
    on sj.subject_id = c.subject_id 
    left join ${tbl_instructor_courses_uploaded} ins
    on ins.course_id = c.course_id
    left join ${tbl_users} u
    on u.user_id = ins.user_id
    left join (
    select *, avg(star) as avg_rate
    from course_reviews crw
    group by crw.course_id
    ) rt
    on rt.course_id = c.course_id 
    left join ${tbl_sales} sal 
    on sal.course_id = c.course_id
    left join (
    select *,count(*) as num_stu_enroll
    from ${tbl_student_enrolls} ste
    group by ste.course_id
    ) ste
    on ste.course_id = c.course_id
    group by c.course_id ;`;
    return db.load(sql);
  },

  feedback(course_id) {
    const sql = `select cr.user_id, cr.course_id, cr.review_content, cr.star ,
    u.user_name
    from ${tbl_course_reviews} cr
    left join ${tbl_users} u
    on u.user_id = cr.user_id
    where cr.course_id = ${course_id};`;
    return db.load(sql);
  },
  acceptAllCourseBySubcat(subject_id) {
    const sql = `update ${tbl_courses} c 
    set c.is_finished = true
    where c.subject_id = ${subject_id};
    `;
    return db.load(sql);
  },
  syllabus(course_id) {
    const sql = `select ins.course_id, ins.chap_id, ch.chap_name,  le.lesson_content,
    ins.lesson_id, le.lesson_name,le.lesson_video_url ,le.flag_reviewable
    from ${tbl_instructor_courses_uploaded} ins
    left join ${tbl_chapters} ch 
    on ch.chap_id = ins.chap_id 
    left join ${tbl_lessons} le 
    on le.lesson_id = ins.lesson_id 
    where ins.course_id = ${course_id} ;`;
    return db.load(sql);
  }
};

module.exports = courseModel;
