import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

export const handlers = [
  // Auth login
  http.post('http://localhost:8080/api/auth/login', async ({ request }) => {
    const body = await request.json();
    if (body.email === 'invalid@example.com') {
      return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }
    return HttpResponse.json({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      tokenType: 'Bearer',
      expiresInMs: 1800000,
      userId: 1,
      email: body.email,
      role: 'CANDIDATE',
    });
  }),

  // Auth refresh
  http.post('http://localhost:8080/api/auth/refresh', () => {
    return HttpResponse.json({
      accessToken: 'refreshed-access-token',
      refreshToken: 'refreshed-refresh-token',
      tokenType: 'Bearer',
      expiresInMs: 1800000,
      userId: 1,
      email: 'user@example.com',
      role: 'CANDIDATE',
    });
  }),

  // Jobs listing
  http.get('http://localhost:8080/api/jobs', ({ request }) => {
    const url = new URL(request.url);
    const keyword = url.searchParams.get('keyword');

    let content = [
      {
        id: 1,
        title: 'Senior Java Backend Engineer',
        departmentName: 'Engineering',
        location: 'Casablanca',
        contractType: 'CDI',
        workMode: 'HYBRID',
        experienceLevel: 'SENIOR',
        requiredSkills: ['Java', 'Spring Boot'],
        status: 'OPEN',
        matchScore: 88,
        createdAt: '2026-10-18T10:00:00',
      },
      {
        id: 2,
        title: 'React Front-End Architect',
        departmentName: 'Product',
        location: 'Rabat',
        contractType: 'CDI',
        workMode: 'REMOTE',
        experienceLevel: 'MID',
        requiredSkills: ['React', 'JavaScript'],
        status: 'OPEN',
        matchScore: 92,
        createdAt: '2026-10-18T10:00:00',
      },
    ];

    if (keyword) {
      content = content.filter(j => j.title.toLowerCase().includes(keyword.toLowerCase()));
    }

    return HttpResponse.json({
      content,
      pageNumber: 0,
      pageSize: 10,
      totalElements: content.length,
      totalPages: 1,
      last: true,
      first: true,
    });
  }),

  // Applications
  http.post('http://localhost:8080/api/applications', async ({ request }) => {
    const body = await request.json();
    if (body.jobOfferId === 999) {
      return HttpResponse.json({ message: 'Already applied' }, { status: 409 });
    }
    return HttpResponse.json(
      {
        id: 101,
        candidateId: 1,
        candidateName: 'Sara El Mansouri',
        candidateEmail: 'sara@example.com',
        jobOfferId: body.jobOfferId,
        status: 'NEW',
        matchingScore: 85,
        appliedAt: new Date().toISOString(),
      },
      { status: 201 }
    );
  }),

  // Candidate me
  http.get('http://localhost:8080/api/candidates/me', () => {
    return HttpResponse.json({
      id: 1,
      userId: 1,
      email: 'sara@example.com',
      firstName: 'Sara',
      lastName: 'El Mansouri',
      location: 'Casablanca',
      skills: ['Java', 'Spring Boot', 'React'],
      experienceYears: 4,
      education: 'Master Degree',
      documents: [],
      createdAt: '2026-10-18T10:00:00',
    });
  }),
];

export const server = setupServer(...handlers);
