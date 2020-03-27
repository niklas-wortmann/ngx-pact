import { HttpClientModule } from '@angular/common/http';
import { TestService } from '../src/app/test.service';
import { TestBed, async } from '@angular/core/testing';

const { Pact } = require('@pact-foundation/pact');

describe('should test basic interaction', () => {
  const provider = new Pact();
  let service: TestService;
  beforeEach(async(() => {
    provider.setup().then(() =>
      provider.addInteraction({
        uponReceiving: 'a request for projects',
        withRequest: {
          method: 'GET',
          path: '/',
          headers: { Accept: 'application/json' }
        },
        willRespondWith: {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          body: { posts: [{ id: 1, title: 'json-server', author: 'typicode' }] }
        }
      })
    );

    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [TestService]
    }).compileComponents();
  }));

  beforeEach(() => {
    service = TestBed.inject(TestService);
  });

  it('should work', done => {
    service.getData().subscribe(data => {
      expect(data).toEqual({
        posts: [{ id: 1, title: 'json-server', author: 'typicode' }]
      });
      done();
    });
  });

  afterEach(() => provider.verify());
  afterAll(() => provider.finalize());
});
