import { HttpClientModule } from '@angular/common/http';
import { TestService } from './test.service';
import { TestBed, async } from '@angular/core/testing';
import { Matchers, PactWeb } from '@pact-foundation/pact-web';

describe('should test basic interaction', () => {
  let provider: PactWeb;
  let service: TestService;

  beforeEach(async () => {
    provider = new PactWeb({
      consumer: 'test',
      provider: 'test',
      port: 1234,
      cors: true
    });
    await provider.addInteraction({
      uponReceiving: 'a request to GET a user',
      state: '',
      withRequest: {
        method: 'GET',
        path: `/test`
      },
      willRespondWith: {
        status: 200,
        body: Matchers.somethingLike({
          posts: [{ id: 1, title: 'json-server', author: 'typicode' }]
        })
      }
    });

    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [TestService]
    }).compileComponents();
  });

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

  afterEach(async () => await provider.verify());
  afterAll(async () => await provider.finalize());
});
