package stx

type AuthPayload struct {
	Auth Auth `json:"auth"`
}

type Auth struct {
	Identity Identity `json:"identity"`
	Scope    Scope    `json:"scope"`
}

type Identity struct {
	Methods  []string `json:"methods"`
	Password Password `json:"password"`
}

type Password struct {
	User User `json:"user"`
}

type User struct {
	Name     string `json:"name"`
	Password string `json:"password"`
	Domain   Domain `json:"domain"`
}

type Scope struct {
	Project Project `json:"project"`
}

type Project struct {
	Name   string `json:"name"`
	Domain Domain `json:"domain"`
}

type Domain struct {
	Name string `json:"name"`
}

type ISystemsResponse struct {
	Isystems []ISystem `json:"isystems"`
}

type ISystem struct {
	Links []SystemLinks `json:"links"`
}

type SystemLinks struct {
	Href string `json:"href"`
	Rel  string `json:"rel"`
}

type TokenResponse struct {
	Token Token `json:"token"`
}

type Token struct {
	Methods   []string  `json:"methods"`
	User      User      `json:"user"`
	AuditIDs  []string  `json:"audit_ids"`
	ExpiresAt string    `json:"expires_at"`
	IssuedAt  string    `json:"issued_at"`
	Project   Project   `json:"project"`
	IsDomain  bool      `json:"is_domain"`
	Roles     []Role    `json:"roles"`
	Catalog   []Catalog `json:"catalog"`
}

// type User struct {
// 	Domain            Domain  `json:"domain"`
// 	ID                string  `json:"id"`
// 	Name              string  `json:"name"`
// 	PasswordExpiresAt *string `json:"password_expires_at"` // null can be represented with a pointer
// }

// type Domain struct {
// 	ID   string `json:"id"`
// 	Name string `json:"name"`
// }

// type Project struct {
// 	Domain Domain `json:"domain"`
// 	ID     string `json:"id"`
// 	Name   string `json:"name"`
// }

type Role struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type Catalog struct {
	Endpoints []Endpoint `json:"endpoints"`
	ID        string     `json:"id"`
	Type      string     `json:"type"`
	Name      string     `json:"name"`
}

type Endpoint struct {
	ID        string `json:"id"`
	Interface string `json:"interface"`
	RegionID  string `json:"region_id"`
	URL       string `json:"url"`
	Region    string `json:"region"`
}
